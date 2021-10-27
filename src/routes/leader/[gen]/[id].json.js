import P from '$lib/api/pokeapi'
import leaders from '$lib/data/leaders.json'

import { map, compose, prop, path, pick, evolve, applySpec } from 'ramda'

const maybe = (f, param) => param ? f(param) : Promise.resolve(null)

const toMoves = map(compose(
  pick(['name', 'power', 'pp', 'priority', 'accuracy', 'type', 'damage_class']),
  evolve({
    type: prop('name'),
    damage_class: prop('name')
  })
))

const toTypes = map(path(['type', 'name']))
const toPokemon = applySpec({
  sprite: s => s.sprites.front_default,
  types: d => toTypes(d.types)
})

export async function get ({ params }) {
  const { gen, id } = params
  const leader = path([gen, 'leaders', id], leaders)

  if (!leader) return

  try {
    const pokemon = await Promise.all(
      leader
        .pokemon
        .map(async p => {
          const data = await P.getPokemonByName(p.name)
          const held = await maybe(P.getItemByName, p.held)
          const moves = await Promise.all(p.moves.map(m => P.getMoveByName(m)))

          return { ...p, ...toPokemon(data), moves: toMoves(moves), held }
        })
    )

    return { body: JSON.stringify({ ...leader, pokemon }) }
  } catch (E) {
    console.log(E.response.status, E.request.path)
  }
}
