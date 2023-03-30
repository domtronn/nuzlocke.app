import tclasses from '$lib/data/trainers.json'
import { Expanded as games } from '$lib/data/games.js';

const ALL = 'all'

export async function GET({ params }) {
  const game = games[params.game]

  console.log(game, params.game)
  
  if (!game && params.game !== ALL) return new Response('', { status: 404 });

  const data = params.game === ALL
        ? [...new Set(Object.values(tclasses))]
        : tclasses[game.gen.toLowerCase()]
  
  return new Response(JSON.stringify(data),{
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  })
}
