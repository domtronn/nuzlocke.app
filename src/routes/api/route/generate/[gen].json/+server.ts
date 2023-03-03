import Routes from '$lib/data/routes.json';
import Pokemon from '../../../pokemon.json/_data.js';

const normalise = id => id.replace(/-/g, '')
const PokemonMap = Pokemon.reduce((acc, it) => ({
    ...acc,
    [normalise(it.alias)]: it
}), {})

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
        const validEncounters = (it as IRoute).encounters?.filter((e) => {
            if (!e) return
            if (!PokemonMap[normalise(e)]) console.log(e)

            try {
                const evoline = PokemonMap[normalise(e)].evoline;
                return !seen.has(evoline);
            } catch (err) {
                console.log('"' + normalise(e) + '"', err)
            }
      });

      if (!validEncounters || !validEncounters.length) return acc;

      const encounter =
        validEncounters[Math.floor(Math.random() * validEncounters.length)];

        seen.add(PokemonMap[normalise(encounter)].evoline);
      return {
        ...acc,
        [it.name]: {
          id,
          pokemon: PokemonMap[normalise(encounter)].alias,
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
