import Pokemon from './index.js'
import { pick } from 'ramda'

const rotate = (keyF, o) => Object.values(o).reduce((acc, it) => ({ ...acc, [keyF(it)]: it }), {})

const PokemonNum = rotate(it => it.name, Pokemon)
const PokemonName = rotate(it => it.name.toLowerCase(), Pokemon)

const props = ['num', 'name', 'alias', 'label', 'sprite']

export async function get ({ params }) {
  const { id } = params
  const pkmn = Pokemon[id] || PokemonNum[id] || PokemonName[id]

  if (!pkmn)
    return { status: 404 }

  return {
    body: {
      ...pick(props, pkmn),
      evos: pkmn.evos.map(i => i.toLowerCase()),
      types: pkmn.types.map(i => i.toLowerCase()),
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'application/json'
    }
  }
}
