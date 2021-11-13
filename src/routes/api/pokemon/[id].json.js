import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
const rotate = (keyF, o) => Object.values(o).reduce((acc, it) => ({ ...acc, [keyF(it)]: it }), {})

const PokemonNum = rotate(it => it.name, Pokemon)
const PokemonName = rotate(it => it.name.toLowerCase(), Pokemon)

// Need id,name,alias,sprite,evos

export async function get ({ params }) {
  const { id } = params
  const pkmn = Pokemon[id] || PokemonNum[id] || PokemonName[id]

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
