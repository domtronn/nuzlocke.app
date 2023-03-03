<script>
  export let data
  const { route, game, links, path } = data

  import '../../../assets/[resource].css/_pokemon.css'
  import 'pokemon-assets/assets/css/items.css'
  import 'pokemon-assets/assets/css/symbols.css'
  import { setContext } from 'svelte'

  import { Hero, Links, Summary, Bosses, Aside } from '$c/Guide'
  import { faq } from '$c/Guide/schemas'

  setContext('game', {
    getLeague: (_, starter) => data.data[starter],
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
  const faqSchema = `<script type="application/ld+json">${JSON.stringify(faq(game, data.data.fire, route))}<\/script>`

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

    <Bosses {path} data={data.data} {game} {...route} />

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
