import { pivotWeaknesses } from './types'
import { movesToCategory, movesToTypes } from './utils'

import calcTeamDamage from './advisor-damage'
import calcRecommendations from './advisor-team'
import calcTypeAdvice from './advisor-types'

interface IMove {
  type: string
  power: number
  damage_class: 'status' | 'special' | 'physical'
}

interface IStats {
  atk: number
  def: number
  spa: number
  spd: number
}

interface IPokemon {
  name: string
  alias: string
  types: [string, string] | [string]
  level: number
  nature: string
  stats: IStats
  original: {
    moves: IMove[]
  }
}

// TODO: Add item modiications to damage output
// TODO: Add ability modifications to damage output

export default function ProcessAdvice(box: IPokemon[], team: IPokemon[]) {
  /** Calculate the maximum effectiveness given a team of pokemons moveseet */
  const teamMoves = team.map((mon) => ({
    alias: mon.alias,
    types: movesToTypes(mon.original.moves)
  }))

  const typeAdvice = calcTypeAdvice(box, teamMoves)
  const dmgAdvice = calcTeamDamage(box, team)

  const moveRatio = (type: string, l) =>
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
    pivotWeaknesses(...types)
  ])

  return {
    weakness: Object.fromEntries(weaknessAdvice),
    calc: Object.fromEntries(dmgAdvice),
    dmg: Object.fromEntries(typeAdvice),
    moves: Object.fromEntries(moveAdvice),
    summary: calcRecommendations(box, team)
  }
}
