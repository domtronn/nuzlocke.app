import { Generations, Move, Pokemon, calculate } from '@smogon/calc'
import calcRecommendations from './_recommended-advice.js'
import calcTypeAdvice from './_type-advice'

import { movesToCategory, movesToTypes } from './_common'
import { pivotWeaknesses as weaknesses } from './_types'

import { capitalise } from '$lib/utils/string'

const nonnull = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => !!v))
const gen = Generations.get(8)

export async function POST({ request }) {
  const body = await request.json()
  const { box, team } = body

  const teamMoves = team.map(({ alias, original: { moves } }) => ({
    alias,
    types: movesToTypes(moves)
  }))

  const typeAdvice = calcTypeAdvice(box, teamMoves)

  const dmgAdvice = Object.fromEntries(
    box.map(({ name: defName, sprite: defId, nature }) => {
      const maxLevel = Math.max(...team.map((t) => +t.level))

      const pkmnLevel = maxLevel < 5 ? 50 : maxLevel
      const enemyLevel = maxLevel < 5 ? 50 + maxLevel : maxLevel

      return [
        defId,
        Object.fromEntries(
          team.map(
            ({ alias: atkName, original: { moves, item, ability } }, i) => {
              return [
                `${atkName}-${i}`,
                moves.map((m) => {
                  if (!m.power || m.damage_clas === 'status') return m
                  try {
                    const res = calculate(
                      gen,
                      new Pokemon(
                        gen,
                        atkName,
                        nonnull({
                          level: +enemyLevel,
                          item,
                          ability: ability.name
                        })
                      ),
                      new Pokemon(
                        gen,
                        defName,
                        nonnull({
                          level: +pkmnLevel,
                          nature: capitalise(nature || 'bashful')
                        })
                      ),
                      new Move(gen, m.name)
                    )

                    return {
                      ...m,
                      kochance: res.kochance().text,
                      desc: res.moveDesc(),
                      range: res.range()
                    }
                  } catch (e) {
                    return m
                  }
                })
              ]
            }
          )
        )
      ]
    })
  )

  const moveRatio = (type, l) =>
    Math.round((l.filter((i) => i === type).length / l.length) * 100)
  const moveAdvice = team.map(({ alias, original: { moves } }) => {
    const categories = movesToCategory(moves).filter((i) => i !== 'status')
    return [
      alias,
      {
        physical: moveRatio('physical', categories),
        special: moveRatio('special', categories)
      }
    ]
  })

  const weaknessAdvice = team.map(({ alias, types }) => [
    alias,
    weaknesses(...types)
  ])

  const payload = {
    calc: dmgAdvice,
    dmg: Object.fromEntries(typeAdvice),
    weakness: Object.fromEntries(weaknessAdvice),
    moves: Object.fromEntries(moveAdvice),
    summary: calcRecommendations(box, team)
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
