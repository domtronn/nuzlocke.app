<script>
  import '../app.postcss'

  import { onMount } from 'svelte'
  import { CookieBanner, Footer } from '$c/navs'

  import deferStyles from '$lib/utils/defer-styles'
  onMount(async () => {
    deferStyles('/assets/pokemon.css')
    deferStyles('/assets/badges.css')
  })

  const title = 'Nuzlocke Tracker'
  const subtitle = 'Track encounters, analyse your team, be prepared'
  const description =
    'Best application to track Pokémon encounters and prepare for every boss battle with details on stats, movesets, & abilities - never lose a Nuzlocke run again.'
</script>

<svelte:head>
  <title>{title} | {subtitle}</title>
  <meta property="og:title" content="{title} | {subtitle}" />
  <meta name="twitter:title" content={title} />

  <meta content={description} name="description" />
  <meta name="twitter:description" content={description} />

  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://img.nuzlocke.app" crossorigin />
</svelte:head>

<slot />

<CookieBanner />
<Footer />

<style global lang="postcss">
  :global(:root) {
    --input-bg: theme('colors.white');
  }
  :global(.dark) {
    --input-bg: theme('colors.gray.800');
  }

  /* latin */
  @font-face {
    font-family: 'VT323';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/vt323/v12/pxiKyp0ihIEF2isfFJXUdVNF.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
</style>
