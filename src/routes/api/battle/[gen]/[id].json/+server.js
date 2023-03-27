import P from '$lib/api/pokeapi';
import { Expanded as games } from '$lib/data/games.js'
import leaders from '$lib/data/league.json';
import patches from '$lib/data/patches.json';

import {
  LegacyTypeMap,
  LegacyMoveMap,
  LegacyDamageClassMap,
} from '$lib/data/legacy'

import { map, compose, prop, path, pick, evolve } from 'ramda';
import { slugify } from '$lib/utils/string'

const titleCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ');

const nonnull = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => !!v));
const maybe = (f, param) => (param ? f(param) : Promise.resolve(null));
const LANG = 'en';

const statNameMap = {
  'special-attack': 'spa',
  'special-defense': 'spd',
  defense: 'def',
  attack: 'atk',
  speed: 'spe',
  hp: 'hp'
};

const toMoves = (moves, patches = {}, physicalSpecialSplit = false) => {
  return map(
    compose(
      (d) => {
        const patched = patches[d.name] || patches[slugify(d.name)]
        const damageClass = patched?.category || d.damage_class

        return nonnull({
          ...d,
          name: patched
            ? titleCase(patched?.locale || d.name)
            : d.name,
          type: patched?.type || d.type,
          power: patched?.power || d.power,
          effect: patched?.effect || d.effect,
          damage_class: damageClass != 'status' && physicalSpecialSplit
            ? LegacyDamageClassMap[patched?.type || d.type]
            : damageClass
        });
      },
      ({ effect_chance, effect_entries, ...rest }) => ({
        ...rest,
        effect: (effect_entries || [])
          .filter(({ effect }) => effect !== 'Inflicts regular damage.')
          .map(({ short_effect }) =>
            short_effect.replace('$effect_chance', effect_chance)
          )
          .join('\n')
      }),
      ({ names, ...rest }) => ({ ...rest, name: names }),
      pick([
        'names',
        'power',
        'priority',
        'type',
        'damage_class',
        'effect_chance',
        'effect_entries'
      ]),
      evolve({
        names: (n) => n.find((l) => l.language.name === LANG).name,
        type: prop('name'),
        damage_class: prop('name')
      })
    )
  )(moves);
};

const toHeld = (held, patch) => {
  if (patch[held]) return patch[held];
  if (patch[held?.name]) return patch[held?.name];

  return nonnull({
    sprite: held.name,
    name: held.names.find((l) => l.language.name === LANG).name,
    effect: held.effect_entries[0]?.short_effect
      || held.flavor_text_entries.find(l => l.language.name === LANG)?.text
  });
};

const toAbility = (ability, patches = {}) => {
  if (patches[ability]) return patches[ability];
  if (patches[ability.name]) return patches[ability.name];

  return nonnull({
    name: ability.names.find((l) => l.language.name === LANG).name,
    effect: ability.effect_entries.find((i) => i.language.name === LANG)
      ?.short_effect
  });
};

const toTypes = map(path(['type', 'name']));
const toPokemon = (p, patches = {}) => {
  let patch = patches[p.name] || patches[p.alias] || patches[p] || {};

  const [, sprite] = /\/sprites\/pokemon\/([0-9]+)/.exec(p?.sprites?.front_default) || []

  const result = nonnull({
    name: p?.species?.name || p,
    sprite: sprite,
    imgUrl: patch?.imgUrl,
    types: patch.types || toTypes(p.types),
    stats: {
      ...(p?.stats || []).reduce(
        (acc, it) => ({
          ...acc,
          [statNameMap[it.stat.name]]: it.base_stat
        }),
        {}
      ),
      ...(patch?.stats || patch?.baseStats || {})
    }
  });


  return result
};

export async function GET({ params, url }) {
  const { gen, id } = params;
  const game = games[gen];

  if (!game) return new Response('', { status: 404 });

  const patch = patches[game?.patchId] || patches[gen] || patches[game.lid] || {};

  const {
    types = {},
    moves = {},
    physicalSpecialSplit = false
  } = game.filter || {}

  const typePatch = LegacyTypeMap[types] || {}
  const movesPatch = LegacyMoveMap[moves] || {}

  const starter = url.searchParams.get('starter');
  const leader = path([game.lid || game.pid, id], leaders);

  if (!leader) return new Response('', { status: 404 });

  try {
    const pokemon = await Promise.all(
      leader.pokemon
        .filter((p) => !p.starter || starter === 'all' || p.starter === starter)
        .map(async (p) => {
          try {
            const data = await P.getPokemonByName(p.name).catch((_) => p.name);
            const held = await maybe(P.getItemByName, p.held).catch((_) => p.held);

            const ability = await maybe(P.getAbilityByName, p.ability).catch((_) => p.ability);
            const abilities = await Promise.all(p.abilities.map(a => maybe(P.getAbilityByName, a).catch(_ => p.ability)))

            const moves = await Promise.all(
              p.moves.filter(i => i).map((m) =>
                P.getMoveByName(m).catch((e) => {
                  if (!patch.move[m]) throw new Error(e);
                  return {
                    name: m,
                    names: [{ name: m, language: { name: LANG } }]
                  };
                })
              )
            );

            return nonnull({
              ...p,
              ...toPokemon(data, {
                ...(typePatch || {}),
                ...(patch.fakemon || {}),
                ...(patch.pokemon || {})
              }),
              moves: toMoves(moves, {
                ...(movesPatch || {}),
                ...(patch.move || {})
              }, physicalSpecialSplit),
              icon: p.sprite,
              held: held ? toHeld(held, patch.item || {}) : null,
              ability: ability ? toAbility(ability, patch.ability || {}) : null,
              abilities: abilities.length > 1 ? abilities.map(a => toAbility(a, patch.ability)): null
            });
          } catch (e) {
            console.error(`[${url}] Error fetching ${p.name}`);
            // Verify pokemon fetch works
            await P.getPokemonByName(p.name).catch((_) => console.error('E_GET_POKEMON: ' + p.name));
            // Verify ability fetch & patch works
            await maybe(P.getAbilityByName, p.ability).catch((_) => {
              if (patch.ability[p.ability]) return
              if (patch.ability[p.ability.name]) return
              console.error('E_GET_ABILITY: ' + p.ability)
            })

            // Verify item fetch & patch works
            await maybe(P.getItemByName, p.held).catch((_) => {
              if (patch.item[p.held]) return
              if (patch.item[p.held.name]) return
              console.error('E_GET_ITEM: ' + p.held)
            });

            // Verify move fetch & patch works
            await Promise.all(
              p.moves.map((m) =>
                P.getMoveByName(m).catch((e) => {
                  if (patch.move[m]) return
                  if (patch.move[m.name]) return
                  console.error('E_GET_MOVE: ' + m)
                })
              )
            )
          }
        })
    );

    return new Response(JSON.stringify({ ...leader, pokemon }), {
      headers: {
        'Cache-Control': 's-maxage=1, stale-while-revalidate',
        'Content-Type': 'application/json'
      }
    });
  } catch (E) {
    console.log('Error fetching');
    console.log(E);
    console.log(E.response?.status || 'XXX', E?.request?.path);
  }
}
