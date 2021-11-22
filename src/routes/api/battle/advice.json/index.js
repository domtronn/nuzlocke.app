import calcTypeAdvice from './_type-advice'
import calcStatAdvice from './_stat-advice'

import { movesToTypes } from './_common'

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

  const result = calcTypeAdvice(box, teamMoves)
  const teamMatchup = team
    .reduce((acc, { name }) => ({
      ...acc,
      [name]: matchup(result, i => i.teamSuitability[name])
    }), {})

  const advice = {
    ...calcStatAdvice(team),
    summary: matchup(result),
    team: teamMatchup,

  }

  console.log(advice)

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      ...advice,
      ...(debug ? {_meta: { result, box, teamMoves }} : {})
    }
  }
}
