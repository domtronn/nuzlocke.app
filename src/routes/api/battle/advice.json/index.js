import calcTypeAdvice from './_type-advice'

import { pivotWeaknesses as weaknesses } from './_types'
import { movesToTypes, movesToCategory } from './_common'

export async function post ({ body }) {
  const { box, team } = body

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

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  }
}
