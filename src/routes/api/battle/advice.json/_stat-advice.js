import { movesToCategory } from './_common'

const threshold = 25
const strong = 100

export default (team) => {
  const stats = team
    .map(({ stats }) => stats)
    .reduce((acc, it, _, arr) => ({
      atk: (acc.atk || 0) + (it.atk / arr.length),
      spa: (acc.spa || 0) + (it.spa / arr.length),
      def: (acc.def || 0) + (it.def / arr.length),
      spd: (acc.spd || 0) + (it.spd / arr.length),
    }), {})

  let offenseType = 'poor'
  if (Math.abs(stats.atk - stats.spa) <= threshold && ((stats.atk + stats.spa) / 2) > strong) offenseType = 'mixed'
  else if (stats.atk - stats.spa > threshold) offenseType = 'physical'
  else if (stats.spa - stats.atk > threshold) offenseType = 'special'

  let defenseType = 'poor'
  if (Math.abs(stats.def - stats.spd) <= threshold) defenseType = 'mixed'
  else if (stats.def - stats.spd > threshold) defenseType = 'physical'
  else if (stats.spd - stats.def > threshold) defenseType = 'special'

  const moves = team.reduce((acc, { moves }) => acc.concat(movesToCategory(moves)), [])
  const specMoves = moves.filter(i => i === 'special').length
  const physMoves = moves.filter(i => i === 'physical').length

  let offenseSplit = 'mixed'
  if ((specMoves / moves) > 0.75) offenseSplit = 'special'
  else if ((physMoves / moves) > 0.75) offenseSplit = 'physical'

  return {
    moves: offenseSplit,
    offense: offenseType,
    defense: defenseType,
  }
}
