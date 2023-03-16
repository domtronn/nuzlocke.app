import games from '$lib/data/games.json';
import patches from '$lib/data/patches.json';

import { LegacyTypeMap } from '$lib/data/legacy'
import Pokemon, { filterdata, sumObj } from '../../pokemon.json/_data.js';

const base = filterdata(Pokemon);

const patchTypes = (pkmn, typeMap) => {
  if (!typeMap) return pkmn
  return pkmn.map((p) => {
    const patch = typeMap[p.alias] || typeMap[p.sprite] || {}
    const types = patch.types || p.types
    return { ...p, types }
  })
}

const patchPokemon = (pkmn, patches, fakemon) => {
  return pkmn.map((p) => {
    const patch = patches[p.alias] || patches[p.sprite] || {};
    const baseStats = {
      ...p.baseStats,
      ...(patch.stats || {})
    };

    const total = sumObj(baseStats);

    return {
      ...p,
      types: patch.types || p.types,
      baseStats,
      total
    };
  }).concat(Object.values(fakemon || {}));
}

export async function GET({ params }) {
  const game = games[params.game];
  const { pokemon, fakemon } = patches[game?.patchId] || patches[params.game] || {};

  if (!game) return new Response('', { status: 404 });
  if (!game.patched && !game.filter)
    return new Response('', {
      status: 301,
      headers: { Location: '/api/pokemon.json' }
    });

  let items = base
  if (game.filter?.types) items = patchTypes(items, LegacyTypeMap[game.filter.types])
  if (game.patched) items = patchPokemon(items, pokemon, fakemon)

  return new Response(JSON.stringify(items), {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  });
}
