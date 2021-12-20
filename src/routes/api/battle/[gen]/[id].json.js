import P from '$lib/api/pokeapi'
import games from '$lib/data/games.json'
import leaders from '$lib/data/league.json'
import patches from '$lib/data/patches.json'

import { map, compose, prop, path, pick, evolve } from 'ramda'

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

const toMoves = (moves, patches = {}) => map(compose(
  d => ({
    ...d,
    type: patches[d.name]?.type || d.type,
    power: patches[d.name]?.power || d.power,
    effect: patches[d.name]?.effect || d.effect
  }),
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
  }),
))(moves)

const toHeld = (held, patch) => {
  if (patch[held]) return patch[held]

  return {
    sprite: held.name,
    name: held.names.find(l => l.language.name === LANG).name,
    effect: held.effect_entries[0]?.short_effect
  }
}

const toAbility = (ability, patches = {}) => {
  if (patches[ability]) return patches[ability]
  if (patches[ability.name]) return patches[ability.name]

  return {
    name: ability.names.find(l => l.language.name === LANG).name,
    effect: ability.effect_entries.find(i => i.language.name === LANG)?.short_effect
  }
}

const toTypes = map(path(['type', 'name']))
const toPokemon = (p, patches = {}) => {
  let patch = patches[p] || {}

  return {
    name: p?.species?.name || p,
    sprite: p?.sprites?.front_default,
    types: patch.types || toTypes(p.types),
    stats: {
      ...(p?.stats || [])
        .reduce((acc, it) => ({
          ...acc,
          [statNameMap[it.stat.name]]: it.base_stat
        }), {}),
      ...(patch?.stats || {})
    }

  }
}

export async function get ({ params, query }) {
  const { gen, id } = params
  const game = games[gen]

  if (!game) return { status: 404 }

  const patch = patches[gen] || {}
  const starter = query.get('starter')
  const leader = path([game.lid || game.pid, id], leaders)

  if (!leader) return

  try {
    const pokemon = await Promise.all(
      leader
        .pokemon
        .filter(p => !p.starter || starter === 'all' || p.starter === starter)
        .map(async p => {
          const data = await P.getPokemonByName(p.name).catch(_ => p.name)
          const held = await maybe(P.getItemByName, p.held).catch(_ => p.held)
          const ability = await maybe(P.getAbilityByName, p.ability).catch(_ => p.ability)
          const moves = await Promise.all(p.moves.map(m => P.getMoveByName(m)))

          return {
            ...p,
            ...toPokemon(data, patch.pokemon || {}),
            moves: toMoves(moves, patch.move || {}),
            held: held ? toHeld(held, patch.item || {}) : null,
            ability: ability ? toAbility(ability, patch.ability || {}) : null,
          }
        })
    )

    return {
      body: JSON.stringify({ ...leader, pokemon }),
      headers: {
        'Cache-Control': 's-maxage=1, stale-while-revalidate',
        'Content-Type': 'application/json'
      }
    }
  } catch (E) {
    console.log(E)
    console.log(E.response?.status || 'XXX', E?.request?.path)
  }
}
