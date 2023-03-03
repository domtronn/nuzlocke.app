import games from '$lib/data/games.json';
import patches from '$lib/data/patches.json';

import Pokemon, { filterdata, sumObj } from '../../pokemon.json/_data.js';
const base = filterdata(Pokemon);

export async function GET({ params }) {
  const game = games[params.game];
  const { pokemon } = patches[params.game] || {};

  if (!game) return { status: 404 };
  if (!game.patched)
    return new Response('', {
      status: 301,
      headers: { Location: '/api/pokemon.json' }
    });

  const items = base.map((p) => {
    const patch = pokemon[p.alias] || pokemon[p.sprite] || {};
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
  });

  return new Response(JSON.stringify(items), {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  });
}
