import Clean from 'clean-css'

import badges from './_badges.css'
import blazingem from './_pokemon-blazingem.css'
import radicalred from './_pokemon-radicalred.css'
import pokemon from './_pokemon.css'

const clean = new Clean({ level: 2 })
const resourceMap = {
  'pokemon-blazingem': blazingem,
  'pokemon-radicalred': radicalred,
  pokemon,
  badges
}

export async function GET({ params }) {
  const { resource } = params
  if (!resourceMap[resource]) return

  return new Response(clean.minify(resourceMap[resource]).styles, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'text/css'
    }
  })
}
