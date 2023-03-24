import { Expanded as Games } from '$lib/data/games.js';
import Routes from '$lib/data/routes.json';
import Patches from '$lib/data/patches.json';
import Pokemon from '../../../pokemon.json/_data.js';

const normalise = id => id.replace(/-/g, '')

enum RouteType {
    route = 'route',
    gym = 'gym'
}

enum GymType {
    rival = 'rival',
    leader = 'gym-leader',
    elite = 'elite-four',
    evil = 'evil-team',
    miniboss = 'mini-boss'
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

interface IMon {
    name: string,
    label: string,
    alias: string,
    sprite: string,
    types: [string, string] | [string],
    evoline: string
}

interface IPatch {
    fakemon: IMon[]
}

const generateGame = (routes: Route[], patch?: IPatch, gen?: string): Record<string, Result | string[]> => {
    let seen = new Set();

    // Patch fakemon into the list of encounters
    const PokemonMap = Pokemon
        .concat(Object.values(patch?.fakemon || {}))
        .reduce((acc, it) => ({
            ...acc,
            [normalise(it.alias)]: it
        }), {})

    return routes
        .filter((r) => r.type === RouteType.route)
        .reduce((acc, it, id) => {
            const validEncounters = (it as IRoute).encounters?.filter((e) => {
                if (!e) return

                try {
                    const evoline = PokemonMap[normalise(e)].evoline;
                    return !seen.has(evoline);
                } catch (err) {
                    console.log(`[${gen}] ${normalise(e)}`)
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

    const game = Games[gen]
    const patch = Patches[game?.patchId] || Patches[gen]

    return new Response(JSON.stringify(generateGame(Routes[gen], patch, gen)), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}
