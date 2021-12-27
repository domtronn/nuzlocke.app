export const sortLexi = ([a], [b]) => a.localeCompare(b)
export const sortWeak = ([, a], [, b]) => (b.weak || 0) - (a.weak || 0)
export const sortResi = ([, a], [, b]) => (b.resist || 0) - (a.resist || 0)
export const sortRatio = ([, a], [, b]) => ((b.weak || 0) / b.resist) - ((a.weak || 0) / a.resist)

export default {
  lexico: sortLexi,
  weak: sortWeak,
  resist: sortResi,
  ratio: sortRatio,
}
