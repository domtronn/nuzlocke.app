import Games from '$lib/data/games.json'
import Themes from '$lib/data/theme.json'

import { normalise } from '$lib/utils/string'

export const prerender = true;

export async function load ({ params, url, fetch }) {
  const { game } = params

  const links = Object
        .entries(Games)
        .filter(([id]) => id !== game)
        .map(([id, g]) => ({ ...g, href: `/guides/${id}` }))
        .reduce((acc, g) => ({
          ...acc,
          [g.gen]: (acc[g.gen] || []).concat(g)
        }), {})

  const titleCase = str =>
        str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
        .join(' ')

  const fetchJson = uri => fetch(uri).then(res => res.json())
  const [pokemon, route, fire, water, grass] = await Promise.all([
    fetchJson(`/api/pokemon.json`),
    fetchJson(`/api/route/${game}.json`),
    fetchJson(`/league/${game}.fire.json`),
    fetchJson(`/league/${game}.water.json`),
    fetchJson(`/league/${game}.grass.json`),
  ])

  const findPokemon = id => pokemon.find(p =>
    normalise(p.alias) === normalise(id) ||
      normalise(p.sprite) === normalise(id)
  )

  const gameObj = { ...Games[game], theme: Themes[game] }

  const routes = route.filter(r => r.type === 'route')
  const encounterMap = routes
        .reduce((acc, route) => ({
          ...acc,
          ...(route.encounters || [])
            .reduce((rest, encounter) => ({
              ...rest,
              [encounter]: (acc[encounter] || []).concat(route.name)
            }), {})
        }), {})

  const encounters = [...new Set(
    route
      .map(r => r.encounters).flat()
      .filter(i => i)
  )]

  const { gen, pid } = gameObj
  const genFilter = (type) => {
    // Show all types for romhacks
    if (gen == 'romhack') return true

    // For gen I games, filter out dark,steel,and fairy
    if (gen == 'I')
      if (!['fr', 'lg'].includes(pid))
        return !['dark', 'steel', 'fairy'].includes(type)

    // For pre gen VI, filter out fairy
    if (['I', 'II', 'III', 'IV', 'V'].includes(gen))
      if (!['or', 'as', 'bd', 'sp'].includes(pid))
        return type !== 'fairy'

    return true
  }

  const encounterdata = encounters
        .reduce((acc, i) => {
          const found = findPokemon(i)
          if (found) return acc.concat({ ...found, original: i })

          console.log(i, 'Not found')
          return acc
        }, [])
        .sort((a, b) => a.num - b.num)
        .reduce((acc, p) => {
          const [t1, t2] = p.types.filter(genFilter)

          return {
            ...acc,
            [t1 || 'normal']: (acc[t1] || []).concat(p),
            ...(t2 ? { [t2]: (acc[t2] || []).concat(p) } : {})
          }
        }, {})

  const gyms = route
        .filter(r => r.type === 'gym')
        .reduce((acc, g) => {
          return {
            ...acc,
            [titleCase(g.group || 'other')]: (acc[titleCase(g.group || 'other')] || [])
              .concat({
                ...g,
                lvlCap: Math.max(...(fire[g.value]?.pokemon?.map(i => i.level) || []))
              })
          }}, {})

  return {
    links, game: gameObj, path: url.pathname,
    route: { routes, gyms, count: encounters.length, encounters: encounterdata, encounterMap },
    data: { fire, water, grass }
  }
}
