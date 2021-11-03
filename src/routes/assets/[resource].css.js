import pokemon from 'pokemon-assets/assets/css/pokemon.css'
import items from 'pokemon-assets/assets/css/items.css'

const resourceMap = { pokemon, items }

export async function get ({ params }) {
  const { resource } = params
  if (!resourceMap[resource])
    return

  return {
    status: 200,
    body: resourceMap[resource],
    headers: {
      'Cache-Control': 'public, max-age 31536000',
      'Content-Type': 'text/css'
    }
  }
}
