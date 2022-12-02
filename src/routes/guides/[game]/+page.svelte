<script context='module'>
  import Games from '$lib/data/games.json'
  import Themes from '$lib/data/theme.json'

  export const prerender = true
  export async function load ({ page, fetch }) {
    const { game } = page.params

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


    const findPokemon = id => pokemon.find(p => p.alias === id || p.sprite === id)
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

    return { props: {
      links, game: gameObj, path: page.path,
      route: { routes, gyms, count: encounters.length, encounters: encounterdata, encounterMap },
      data: { fire, water, grass }
    } }
  }
</script>

<script>
  export let data, route, game, links, path

  import 'pokemon-assets/assets/css/items.css'
  import 'pokemon-assets/assets/css/pokemon.css'
  import 'pokemon-assets/assets/css/symbols.css'
  import { setContext } from 'svelte'

  import { Hero, Links, Summary, Bosses, Aside } from '$c/Guide'
  import { faq } from '$c/Guide/schemas'

  setContext('game', {
    getLeague: (_, starter) => data[starter],
  })
  setContext('simple-modal', {
    open: false
  })

  const gymCount = Object.values(route.gyms).flat().length
  const encounterCount = route.count
  const routeCount = route.routes.length

  const title = `Nuzlocke Tracker | Pokémon ${game.title} Nuzlocke Guide`
  const description = `This guide shows you all ${encounterCount} Pokémon available across ${routeCount} route encounters in Pokémon ${game.title}, as well as detailed information on all ${gymCount} boss battles!`

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `A Nuzlocke guide for Pokémon ${game.title}`,
    "alternativeHeadline": `A guide and overview to Nuzlocking Pokémon ${game.title}`,
    "image": `https://nuzlocke.app${game.logo}.png`,
    "author": "Nuzlocke Tracker",
    "genre": "Pokémon",
    "keywords": `pokemon nuzlocke ${game.title} encounters boss battles fights`,
    "url": `https://nuzlocke.app/guides/${game.pid}`,
    "datePublished": "2022-01-07",
    "dateCreated": "2022-01-07",
    "dateModified": "2022-01-07",
    "description": description
  }
  const articleSchema = `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`
  const faqSchema = `<script type="application/ld+json">${JSON.stringify(faq(game, data.fire, route))}<\/script>`

</script>

<svelte:head>
  <title>{title}</title>
  <meta property=og:title content={title} />
  <meta name=twitter:title content={title} />

  <meta content={description} name=description />
  <meta content={description} name=twitter:description  />
</svelte:head>

{#key game.pid}
<Hero {...game}>

  <Aside {path} {...route} />

  <article class=g-container>

    <Summary {path} {game} {...route} />

    <Bosses {path} {data} {game} {...route} />

  </article>

</Hero>

<Links {links} />

{@html articleSchema}
{@html faqSchema}
{/key}

<style lang="postcss">

  :global(button.compare) { display: none; }
  :global(svg.lines) {
    z-index: -10;
    @apply absolute top-px w-full -translate-y-full
  }
</style>
