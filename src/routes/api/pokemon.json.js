import { pick } from 'ramda'
import Pokemon from 'pokemon-assets/assets/data/pokemon.json'

export async function get ({ params, query }) {
  if (!query.get('p'))
    return { status: 404 }

  const plist = query.get('p').split(',')

  return {
    body: pick(plist, Pokemon),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
