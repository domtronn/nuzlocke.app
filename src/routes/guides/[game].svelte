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

    const routes = route.filter(r => r.type === 'route')
    const encounters = [...new Set(
      route
        .map(r => r.encounters).flat()
        .filter(i => i)
    )]

    const encounterdata = encounters.reduce((acc, i) => {
      const found = pokemon.find(p => p.alias === i || p.sprite === i)
      if (found) return acc.concat(found)

      console.log(i, 'Not found')
      return acc
    }, [])
          .sort((a, b) => a.num - b.num)
          .reduce((acc, p) => ({
            ...acc,
            [p.types[0]]: (acc[p.types[0]] || []).concat(p.sprite),
            ...(p.types[1] ? {
              [p.types[1]]: (acc[p.types[1]] || []).concat(p.sprite)
            } : {})
          }), {})

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

    const gameObj = { ...Games[game], theme: Themes[game] }
    return { props: {
      links, game: gameObj, path: page.path,
      route: { routes, gyms, count: encounters.length, encounters: encounterdata },
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
    "image": `https://nuzlocke.vercel.app${game.logo}.png`,
    "author": "Nuzlocke Tracker",
    "genre": "Pokémon",
    "keywords": `pokemon nuzlocke ${game.title} encounters boss battles fights`,
    "url": `https://nuzlocke.vercel.app/guides/${game.pid}`,
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

<style>

  :global(button.compare) { display: none; }
  :global(svg.lines) {
    z-index: -10;
    @apply absolute top-px w-full -translate-y-full
  }
</style>
