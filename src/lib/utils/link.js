import { toKebabCase } from '$lib/utils/string'
import { Expanded as Games } from '$lib/data/games.js'

export const toDb = id => `https://pokemondb.net/pokedex/${id}`.toLowerCase()
export const toDbLocation = (game, loc) => {
  const { region } = Games[game]
  if (!region) return null

  const norm = toKebabCase(
    loc.replace(/Underground: /g, '')
  )

  return `https://pokemondb.net/location/${region}-${norm}`
}
