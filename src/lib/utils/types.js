import { canonTypes as types } from '$lib/data/types'
import { moveResistance } from '$utils/advice/advisor-types'
import { isEmpty } from '$utils/obj'

function sortFn(a, b) {
  return (
    (b[1].resist || 0) - (a[1].resist || 0) ||
    (b[1].weak || 0) - (a[1].weak || 0) ||
    a[0].localeCompare(b[0])
  )
}

export const summarise = (team) => {
  const result = types.reduce((acc, type) => {
    const dmg = team.map(({ types }) => moveResistance(type, types))
    const effectivess = dmg.reduce((acc, dmg) => {
      if (dmg === 1) return acc

      const id = dmg < 1 ? 'resist' : 'weak'
      return { ...acc, [id]: (acc[id] ?? 0) + 1 }
    }, {})

    if (isEmpty(effectivess)) return acc
    return { ...acc, [type]: effectivess }
  }, {})

  const max = Math.max(
    ...Object.values(result)
      .map((it) => [it.weak || 0, it.resist || 0])
      .flat()
  )

  return {
    result: Object.entries(result).sort(sortFn),
    max
  }
}
