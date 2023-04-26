import { canonTypes as types } from '$lib/data/types'

import { moveResistance } from '$utils/advice/advisor-types'
import { typeAdvantages } from '$utils/advice/types'

/**
 * Calculates the box coverage for types
 * for suggestions of what types to catch
 */

export async function POST({ request }) {
  const { box } = await request.json()
  const analysis = Object.entries(
    types.reduce((acc, it) => {
      const dmg = box.map(({ types }) => moveResistance(it, types))
      const minDmg = dmg.reduce((acc, it) => {
        const id = it < 1 ? 'resist' : it > 1 ? 'weak' : 'neutral'
        return {
          ...acc,
          [id]: (+acc[id] || 0) + 1
        }
      }, {})

      return { ...acc, [it]: minDmg }
    }, {})
  )

  const suggestMap = analysis
    .filter(([, { resist }]) => !resist)
    .map(([type]) => {
      return [
        ...(typeAdvantages[type]['0.5'] || []),
        ...(typeAdvantages[type]['0'] || [])
      ]
    })
    .flat()
    .reduce(
      (acc, it) => ({
        ...acc,
        [it]: (acc[it] || 0) + 1
      }),
      {}
    )

  const suggestions = Object.entries(suggestMap)
    .sort(([, a], [, b]) => b - a)
    .map(([t]) => t)

  return new Response(JSON.stringify({ analysis, suggestions }))
}
