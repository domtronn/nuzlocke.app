<script context='module'>
  export function load ({ page }) {
    return { props: { path: page.path } }
  }
</script>

<script>
  export let path = ''

  import '../app.css'
  import { setContext } from 'svelte'
  import { browser, dev } from '$app/env'

  import { fetchData, fetchLeague } from '$utils/fetchers'
  import { GameHeading, NavHeading, CookieBanner, Footer } from '$c/navs'
  import Modal from 'svelte-simple-modal'

  import * as Sentry from '@sentry/browser'
  import { Integrations } from '@sentry/tracing'

  Sentry.init({
    dsn: 'https://c785c122f32c47d68a777aea5af577b1@o1091749.ingest.sentry.io/6109144',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: dev ? 0 : 1.0,
  })


  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: fetchData,
    getPkmn: id => fetchData().then((ps = []) => ps.find(p => p.num == id || p.name == id || p.alias == id || p.sprite == id)),
    getPkmns: (ids = []) => fetchData()
      .then((ps = []) => ps
            .filter(p => ids.includes(p.num) || ids.includes(p.name) || ids.includes(p.alias))
            .reduce((acc, it) => ({ ...acc, [it.alias]: it }), {})),
  })
</script>

<style global lang="postcss">
  :global(:root){ --input-bg: theme('colors.white'); }
  :global(.dark) { --input-bg: theme('colors.gray.800'); }

  /* latin */
  @font-face {
    font-family: 'VT323';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/vt323/v12/pxiKyp0ihIEF2isfFJXUdVNF.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
</style>

<svelte:head>
  <title>Nuzlocke Tracker | Track Pokémon encounters, analyse your team, and be prepared</title>
  <meta property="og:title" content="Nuzlocke Tracker | Track Pokémon encounters, analyse your team, and be prepared" />
  <meta name="twitter:title" content="Nuzlocke Tracker" />

  <meta content="Best application for tracking Pokémon encounters and helping prepare you for the boss batles on your Nuzlocke runs. Get insights into team match ups, compare stat blocks and get detail on Gym movesets & abilities - all in one place - so you never lose again." name="description" />
  <meta name="twitter:description" content="Best application for tracking Pokémon encounters and helping prepare you for the boss batles on your Nuzlocke runs. Get insights into team match ups, compare stat blocks and get detail on Gym movesets & abilities - all in one place - so you never lose again." />


  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://raw.githubusercontent.com" crossorigin>
  {#if !dev && browser}
    <script async defer
            data-website-id="dae73bab-b128-46a6-93e1-46ebc3da783c"
            src="https://nuzlocke-analytics.vercel.app/umami.js">
    </script>
  {/if}
</svelte:head>

{#if ['/game', '/box'].includes(path) }
  <GameHeading />
{:else}
  <NavHeading />
{/if}

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  styleWindow={{ background: 'transparent !important' }}
  styleContent={{ padding: '0 !important' }}
>
  <slot />
</Modal>

<CookieBanner />

<iframe id='cdls' src='https://nuzlocke.vercel.app/iframe.html' title='Cross Domain LocalStorage migration interface' />
<Footer />
