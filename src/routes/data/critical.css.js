import spritesheet from 'pokemon-assets/assets/css/pokemon.css'

export async function get ({ params }) {
  return {
    status: 200,
    body: spritesheet,
    headers: {
      'Cache-Control': 'public, max-age 31536000',
      'Content-Type': 'text/css'
    }
  }
}
