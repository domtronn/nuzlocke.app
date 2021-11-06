<script context='module'>
  export function load ({ page }) {
    return { props: { path: page.path } }
  }
</script>

<script>
  export let path = ''

  import '../app.css'
  import { onMount } from 'svelte'

  import GameHeading from '$lib/components/game-heading.svelte'

  const mountStyle = (src) => {
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
    mountStyle('/assets/items.css')
    if (path === '/game') mountStyle('/assets/pokemon.css')
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

<div class='absolute top-0 w-full g-g>

{#if ['/game', '/box'].includes(path) }
  <GameHeading />
{/if}

<slot />
