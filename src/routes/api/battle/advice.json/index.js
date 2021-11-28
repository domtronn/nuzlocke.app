import calcTypeAdvice from './_type-advice'

import { pivotWeaknesses as weaknesses } from './_types'
import { movesToTypes, movesToCategory } from './_common'

const matchup = (data, f = d => d.suitability) => ({
  great: data.reduce((acc, it) => f(it) === 2 ? acc.concat(it.name) : acc, []),
  okay: data.reduce((acc, it) => f(it) === 1 ? acc.concat(it.name) : acc, []),
  dont: data.reduce((acc, it) => f(it) === -1 ? acc.concat(it.name) : acc, []),
})

export async function post ({ body }) {
  const { box, team, debug } = body

  const teamMoves = team
    .map(({ name, moves }) => ({
      name,
      types: movesToTypes(moves)
    }))

  const typeAdvice = calcTypeAdvice(box, teamMoves)

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
    dmg: Object.fromEntries(typeAdvice),
    weakness: Object.fromEntries(weaknessAdvice),
    moves: Object.fromEntries(moveAdvice),
  }

  console.log(payload)

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  }
}
