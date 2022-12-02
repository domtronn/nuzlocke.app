import Routes from '$lib/data/routes.json';
import Pokemon from '../../../pokemon.json/_data.js';

enum RouteType {
  route = 'route',
  gym = 'gym'
}

enum GymType {
  rival = 'rival',
  leader = 'gym-leader',
  elite = 'elite-four',
  evil = 'evil-team'
}

interface IRoute {
  name: string;
  type: RouteType.route;
  encounters: string[];
}

interface IGym {
  type: RouteType.gym;
  name: string;
  value: string;
  boss: string;
  group: GymType;
}

type Route = IGym | IRoute;

interface Result {
  id: number;
  pokemon: string;
  location: string;
}

const generateGame = (routes: Route[]): Record<string, Result | string[]> => {
  let seen = new Set();

  return routes
    .filter((r) => r.type === RouteType.route)
    .reduce((acc, it, id) => {
      const validEncounters = (it as IRoute).encounters.filter((e) => {
        const evoline = Pokemon[e.replace(/-/g, '')].evoline;

        return !seen.has(evoline);
      });

      if (!validEncounters.length) return acc;

      const encounter =
        validEncounters[Math.floor(Math.random() * validEncounters.length)];

      seen.add(Pokemon[encounter.replace(/-/g, '')].evoline);
      return {
        ...acc,
        [it.name]: {
          id,
          pokemon: encounter,
          location: it.name,
          hidden: true
        }
      };
    }, {});
};

export async function GET({ params }) {
  const { gen } = params;

  if (!Routes[gen]) return new Response('', { status: 404 });

  return new Response(JSON.stringify(generateGame(Routes[gen])), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate'
    }
  });
}
