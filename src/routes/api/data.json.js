import PokemonData from 'pokemon-assets/assets/data/pokemon.json'
import _MovesData from 'pokemon-assets/assets/data/moves.json'
import _AbilityData from 'pokemon-assets/assets/data/abilities.json'
import _ItemData from 'pokemon-assets/assets/data/items.json'

const mapObj = (obj, f, g) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [g ? g(v) : k, f(v)]))
const pick = (obj, arr) => arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {})

const AbilityData = Object.values(_AbilityData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
const MovesData = Object.values(_MovesData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
const ItemData = Object.values(_ItemData).reduce((ac, it) => ({ ...ac, [it.sprite]: it }), {})

const data = {
  pokemon: mapObj(PokemonData, p => pick(p, ['num', 'name', 'types', 'baseStats', 'sprite']), v => v.sprite),
  abilities: mapObj(AbilityData, a => pick(a, ['name'])),
  moves: mapObj(MovesData, m => pick(m, ['name', 'category', 'basePower', 'priority', 'type'])),
  items: mapObj(ItemData, i => pick(i, ['name', 'sprite'])),
}

export async function get () {
  return {
    status: 200,
    body: data
  }
}
