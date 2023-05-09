<script>
  export let data
  const { route, game, links, path, html, attributes } = data

  import '../../../assets/[resource].css/_pokemon.css'
  import 'pokemon-assets/assets/css/items.css'
  import 'pokemon-assets/assets/css/symbols.css'
  import { setContext } from 'svelte'

  import { Hero, Links, Summary, Bosses, Aside } from '$c/Guide'
  import { faq } from '$c/Guide/schemas'

  setContext('game', {
    getLeague: (_, starter) => data.data[starter]
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
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `A Nuzlocke guide for Pokémon ${game.title}`,
    alternativeHeadline: `A guide and overview to Nuzlocking Pokémon ${game.title}`,
    image: `https://img.nuzlocke.app${game.logo}@2.png`,
    author: 'Nuzlocke Tracker',
    genre: 'Pokémon',
    keywords: `pokemon nuzlocke ${game.title} encounters boss battles fights`,
    url: `https://nuzlocke.app/${path}`,
    datePublished: attributes.created || '2022-01-07',
    dateCreated: attributes.created || '2022-01-07',
    dateModified: attributes.updated || attributes.created || '2022-01-07',
    description: description
  }
  const articleSchema = `<script type="application/ld+json">${JSON.stringify(
    schema
  )}<\/script>`
  const faqSchema = `<script type="application/ld+json">${JSON.stringify(
    faq(game, data.data.fire, route)
  )}<\/script>`
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  <meta content={description} name="description" />
  <meta content={description} name="twitter:description" />

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      var lazyBackground = document.querySelector('.pkm')

      if ('IntersectionObserver' in window) {
        let lazyBackgroundObserver = new IntersectionObserver(function (
          entries,
          observer
        ) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              document.body.classList.add('lazy-pkm')
              lazyBackgroundObserver.unobserve(entry.target)
            }
          })
        })

        lazyBackgroundObserver.observe(lazyBackground)
      }
    })
  </script>
</svelte:head>

{#key game.pid}
  <Hero {...game} {...attributes || {}}>
    <Aside {path} {...route} />

    <article class="g-container">
      {#if html}
        <section class="doc">
          {@html html}
        </section>
      {/if}

      <Summary {path} {game} {...route} />

      <Bosses {path} data={data.data} {game} {...route} />
    </article>
  </Hero>

  <Links {links} />

  {@html articleSchema}
  {@html faqSchema}
{/key}

<style lang="postcss">
  :global(body),
  :global(html) {
    overflow-x: hidden;
  }
  :global(button.compare) {
    display: none;
  }
  :global(svg.lines) {
    z-index: -10;
    @apply absolute top-px w-full -translate-y-full;
  }

  section.doc {
    @apply my-6  max-w-prose;
  }

  section.doc :global(*) {
    @apply leading-6 tracking-wide;
  }

  section.doc :global(p) {
    @apply pb-4;
  }

  section.doc :global(hr) {
    @apply my-6 opacity-50;
  }

  section.doc :global(li) {
    @apply mx-8;
  }

  section.doc :global(img) {
    @apply inline-flex items-center justify-center;
  }

  section.doc :global(p:has(img)) {
    @apply inline-flex w-full justify-center;
  }

  section.doc :global(a) {
    @apply underline underline-offset-4;
  }

  section.doc :global(a:hover) {
    @apply text-orange-500;
  }

  section.doc :global(h2),
  section.doc :global(h3),
  section.doc :global(h3) {
    @apply pb-4 pt-6;
  }

  section.doc :global(h2) {
    @apply text-2xl font-bold;
  }
  section.doc :global(h3) {
    @apply text-2xl font-bold;
  }
  section.doc :global(h4) {
    @apply text-lg;
  }
</style>
