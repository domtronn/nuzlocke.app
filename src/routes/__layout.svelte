<script context='module'>
  export function load ({ page }) {
    return { props: { path: page.path } }
  }
</script>

<script>
  export let path = ''

  import '../app.css'
  import { setContext } from 'svelte'
  import { browser } from '$app/env'

  import { GameHeading, NavHeading, CookieBanner } from '$lib/components/navs'

  import Icon from 'svelte-icons-pack'
  import GitHub from 'svelte-icons-pack/bi/BiLogoGithub'

  let data
  const fetchData = async () => {
    if (!browser) return
    if (data) return data
    const res = await fetch('/api/pokemon/all.json')
    data = await res.json()
    return data
  }

  setContext('game', {
    getAllPkmn: fetchData,
    getPkmn: id => fetchData().then((ps = []) => ps.find(p => p.num == id || p.name == id || p.alias == id)),
    getPkmns: ids => fetchData()
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
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</svelte:head>

{#if ['/game', '/box'].includes(path) }
  <GameHeading />
{:else}
  <NavHeading />
{/if}

<slot />

<CookieBanner />

<footer class='text-center w-full absolute bottom-0 my-8 sm:my-10 px-4 text-tiny md:text-xs text-gray-500 dark:text-gray-400 leading-3'>
  <p class='flex justify-center text-2xl gap-x-2 '>
    <a href="https://github.com/domtronn/dc-nuzlocke/issues/new?assignees=&labels=&template=bug_report.md&title="
       rel="noreferrer" target="_blank">
      <button aria-label='Report bugs' title='Report bugs' class='transition-colors dark:hover:text-white hover:text-black p-3'><Icon className='fill-current' src={GitHub} /></button>
    </a>
  </p>

  All content & design © Pokémon Nuzlocke Tracker, 2021-{(new Date()).getFullYear()}. <a class='underline transition dark:hover:text-gray-400 hover:text-gray-200' href='/privacy-policy'>Privacy Policy</a>.
  <br class='hidden md:block' />
  Pokémon images & names © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM
</footer>
