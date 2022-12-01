<script>
  import "../app.postcss";
  import "../app.postcss";
  import { page } from '$app/stores'
  let path = $page.url.pathname;

  import "../app.postcss";
  import { setContext } from 'svelte';
  import { browser, dev } from '$app/environment';

  import { fetchData, fetchLeague } from '$utils/fetchers';
  import { GameHeading, NavHeading, CookieBanner, Footer } from '$c/navs';
  import Modal from 'svelte-simple-modal';

  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: fetchData,
    getPkmn: (id) =>
      fetchData().then((ps = []) =>
        ps.find(
          (p) => p.num == id || p.name == id || p.alias == id || p.sprite == id
        )
      ),
    getPkmns: (ids = []) =>
      fetchData().then((ps = []) =>
        ps
          .filter(
            (p) =>
              ids.includes(p.num) ||
              ids.includes(p.name) ||
              ids.includes(p.alias)
          )
          .reduce((acc, it) => ({ ...acc, [it.alias]: it }), {})
      )
  });

  const title = 'Nuzlocke Tracker';
  const subtitle = 'Track encounters, analyse your team, be prepared';
  const description =
    'Best application to track Pokémon encounters and prepare for every boss battle with details on stats, movesets, & abilities - never lose a Nuzlocke run again.';
</script>

<svelte:head>
  <title>{title} | {subtitle}</title>
  <meta property="og:title" content="{title} | {subtitle}" />
  <meta name="twitter:title" content={title} />

  <meta content={description} name="description" />
  <meta name="twitter:description" content={description} />

  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://img.nuzlocke.app" crossorigin />

  {#if !dev && browser}
    <script
      async
      defer
      data-website-id="dae73bab-b128-46a6-93e1-46ebc3da783c"
      src="https://nuzlocke-analytics.vercel.app/umami.js">
    </script>
  {/if}
</svelte:head>

{#if ['/game', '/box'].includes(path)}
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
