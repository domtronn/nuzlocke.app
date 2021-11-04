import Clean from 'clean-css'

import pokemon from 'pokemon-assets/assets/css/pokemon.css'
import items from 'pokemon-assets/assets/css/items.css'

const clean = new Clean()
const resourceMap = { pokemon, items }

export async function get ({ params }) {
  const { resource } = params
  if (!resourceMap[resource])
    return

  return {
    status: 200,
    body: clean.minify(resourceMap[resource]).styles,
    headers: {
      'Cache-Control': 'public, max-age 31536000',
      'Content-Type': 'text/css'
    }
  }
}
