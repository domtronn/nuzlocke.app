import P from '$lib/api/pokeapi'
import games from '$lib/data/games.json'
import leaders from '$lib/data/league.json'

import { map, compose, prop, path, pick, evolve, applySpec } from 'ramda'

const maybe = (f, param) => param ? f(param) : Promise.resolve(null)
const LANG = 'en'

const statNameMap = {
  'special-attack': 'spa',
  'special-defense': 'spd',
  'defense': 'def',
  'attack': 'atk',
  'speed': 'spe',
  'hp': 'hp',
}

const toMoves = map(compose(
  ({ effect_chance, effect_entries, ...rest }) => ({
    ...rest,
    effect: effect_entries
      .filter(({ effect }) => effect !== 'Inflicts regular damage.')
      .map(({ short_effect }) => short_effect.replace('$effect_chance', effect_chance)).join('\n')
  }),
  ({ names, ...rest }) => ({ ...rest, name: names }),
  pick(['names', 'power', 'priority', 'type', 'damage_class', 'effect_chance', 'effect_entries']),
  evolve({
    names: n => n.find(l => l.language.name === LANG).name,
    type: prop('name'),
    damage_class: prop('name')
  })
))

const toHeld = applySpec({
  sprite: s => s.name,
  name: s => s.names.find(l => l.language.name === LANG).name,
  effect: s => s.effect_entries[0]?.short_effect
})

const toAbility = applySpec({
  name: s => s.names.find(l => l.language.name === LANG).name,
  effect: s => s.effect_entries.find(i => i.language.name === LANG)?.short_effect
})

const toTypes = map(path(['type', 'name']))
const toPokemon = applySpec({
  name: s => s.species.name,
  sprite: s => s.sprites.front_default,
  types: d => toTypes(d.types),
  stats: d => d
    .stats
    .reduce((acc, it) => ({
      ...acc,
      [statNameMap[it.stat.name]]: it.base_stat
    }), {})
})

export async function get ({ params, query }) {
  const { gen, id } = params
  const game = games[gen]

  if (!game) return { status: 404 }

  const starter = query.get('starter')
  const leader = path([game.lid || game.pid, id], leaders)

  if (!leader) return

  try {
    const pokemon = await Promise.all(
      leader
        .pokemon
        .filter(p => !p.starter || p.starter === starter)
        .map(async p => {
          const data = await P.getPokemonByName(p.name)
          const held = await maybe(P.getItemByName, p.held)
          const ability = await maybe(P.getAbilityByName, p.ability)
          const moves = await Promise.all(p.moves.map(m => P.getMoveByName(m)))

          return {
            ...p,
            ...toPokemon(data),
            moves: toMoves(moves),
            held: held ? toHeld(held) : null,
            ability: ability ? toAbility(ability): null,
          }
        })
    )

    return {
      body: JSON.stringify({ ...leader, pokemon }),
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json'
      }
    }
  } catch (E) {
    console.log(E)
    console.log(E.response.status, E.request.path)
  }
}
