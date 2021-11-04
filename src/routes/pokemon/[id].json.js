import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
const PokemonNum = Object
  .values(Pokemon)
  .reduce((acc, it) => ({
    ...acc,
    [it.num]: it
  }), {})

export async function get ({ params }) {
  const { id } = params
  const pkmn = Pokemon[id] || PokemonNum[id]

  if (!pkmn)
    return { status: 404 }

  return {
    body: pkmn,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'application/json'
    }
  }
}
