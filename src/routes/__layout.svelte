<script context='module'>
  export function load ({ page }) {
    return { props: { path: page.path } }
  }
</script>

<script>
  export let path = ''

  import '../app.css'
  import { onMount } from 'svelte'

  import { slide } from 'svelte/transition'

  import GameHeading from '$lib/components/game-heading.svelte'
  import NavHeading from '$lib/components/nav-heading.svelte'
  import CookieBanner from '$lib/components/cookie-banner.svelte'

  const deferStyle = (src) => {
    if (document.createStyleSheet) document.createStyleSheet(src)
    else {
      const [head] = document.getElementsByTagName('head')
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = src
      head.appendChild(link)
    }
  }

  onMount(() => {
    if (path !== '/game') return
    deferStyle('/assets/items.css')
    deferStyle('/assets/pokemon.css')
  })
</script>

<style global lang="postcss">
  /* latin */
  @font-face {
    font-family: 'VT323';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/vt323/v12/pxiKyp0ihIEF2isfFJXUdVNF.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  .pkm-wrapper {
    width: 67px;
    height: 56px;
    line-height: 54px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    padding: 1px;
  }

  .pkm {
    display: inline-block;
    vertical-align: middle;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
  }
</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</svelte:head>

{#if ['/game', '/box'].includes(path) }
  <GameHeading />
{:else}
  <NavHeading />
{/if}

<slot />

<CookieBanner />

<footer class='text-center absolute w-full bottom-0 mb-4 px-4 text-tiny md:text-xs text-gray-500 dark:text-gray-400 leading-3'>
  All content & design © Pokémon Nuzlocke Tracker, 2021-{(new Date()).getFullYear()}. <a class='underline transition dark:hover:text-gray-400 hover:text-gray-200' href='/privacy-policy'>Privacy Policy</a>.
  <br class='hidden md:block' />
  Pokémon images & names © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM
</footer>
