import pokemon from '../../../api/pokemon.json/_data.js';
import { normalise } from '$lib/utils/string'

export function GET({ params }) {
  const { id } = params
  
  const match = pokemon.find((p) => {
    return normalise(id) === normalise(p.alias) || 
      normalise(id) === normalise(p.alias) || 
      normalise(id) === normalise(p.name) || 
      normalise(id) === normalise(p.sprite) 
  })

  if (!match) {
    return new Response('', { status: 404 })
  }

  return new Response('', {
    status: 301,
    headers: {
      location: `https://img.nuzlocke.app/sprite/${match.imgId}.png`
    }
  })
}
