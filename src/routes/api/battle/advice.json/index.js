import { calculate, Generations, Pokemon, Move } from '@smogon/calc'

import calcTypeAdvice from './_type-advice'

import { pivotWeaknesses as weaknesses } from './_types'
import { movesToTypes, movesToCategory } from './_common'

import { capitalise } from '$lib/utils/string'

const nonnull = o => Object.fromEntries(Object.entries(o).filter(([, v]) => !!v))
const gen = Generations.get(8)

export async function post ({ body }) {
  const { box, team } = body

  const teamMoves = team
    .map(({ name, moves }) => ({
      name,
      types: movesToTypes(moves)
    }))

  const typeAdvice = calcTypeAdvice(box, teamMoves)

  const dmgAdvice = Object.fromEntries(
    box.map(({ name: defName, sprite: defId, nature }) => {
      return [
        defId,
        Object.fromEntries(
          team
            .map(({ name: atkName, moves, level, item, ability, ...rest }) => {
              return [atkName, moves.filter(m => !!m.power && m.damage_class !== 'status').map(m => {
                try {
                  const res = calculate(
                    gen,
                    new Pokemon(gen, atkName, nonnull({ level: +level, item, ability: ability.name })),
                    new Pokemon(gen, defName, nonnull({ level: +level, nature: capitalise(nature || 'bashful') })),
                    new Move(gen, m.name)
                  )

                  return { ...m, kochance: res.kochance().text, dmgrange: res.moveDesc() }
                } catch (e) { return m }
              })]
            })
        )
      ]
    })
  )

  const moveRatio = (type, l) => Math.round(l.filter(i => i === type).length / l.length * 100)
  const moveAdvice = team
    .map(({ name, moves }) => {
      const categories = movesToCategory(moves).filter(i => i !== 'status')
      return [
        name,
        {
          physical: moveRatio('physical', categories),
          special: moveRatio('special', categories)
        }
      ]
    })

  const weaknessAdvice = team.map(({ name, types }) => [
    name,
    weaknesses(...types)
  ])

  const payload = {
    calc: dmgAdvice,
    dmg: Object.fromEntries(typeAdvice),
    weakness: Object.fromEntries(weaknessAdvice),
    moves: Object.fromEntries(moveAdvice),
  }

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  }
}
