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

  import { getGen } from '$lib/store'
  import { GameHeading, NavHeading, CookieBanner } from '$lib/components/navs'
  import Modal from 'svelte-simple-modal'

  import Icon from 'svelte-icons-pack'
  import Coffee from 'svelte-icons-pack/si/SiBuymeacoffee'
  import GitHub from 'svelte-icons-pack/bi/BiLogoGithub'
  import Discord from 'svelte-icons-pack/bi/BiLogoDiscord'
  import Heart from 'svelte-icons-pack/ti/TiHeartFullOutline'

  import * as Sentry from '@sentry/browser'
  import { Integrations } from '@sentry/tracing'

  Sentry.init({
    dsn: 'https://c785c122f32c47d68a777aea5af577b1@o1091749.ingest.sentry.io/6109144',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: dev ? 0 : 1.0,
  })

  let data = {}
  const fetchData = async () => {
    if (!browser) return

    const gen = await getGen()
    const uri = `/api/${gen}/pokemon.json`
    if (data[gen]) return data[gen]        // Return the raw data if it exists
    if (!data[uri]) data[uri] = fetch(uri) // "Cache" the promise rather than make a new fetch each time
      .then(res => res.json())

    data[gen] = await data[uri]
    return data[gen]
  }

  setContext('game', {
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

  footer { @apply text-center w-full absolute bottom-0 my-4 sm:my-6 px-4 text-tiny md:text-xs text-gray-500 dark:text-gray-400 leading-3; }
  footer > p { @apply flex justify-center text-2xl gap-x-2; }
  footer a,
  footer button { @apply transition-colors dark:hover:text-white hover:text-black; }
  footer button { @apply p-3 }
  footer > p + a { @apply underline p-0; }
</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://raw.githubusercontent.com" crossorigin>
  {#if !dev && browser}
    <script async defer data-website-id="dae73bab-b128-46a6-93e1-46ebc3da783c" src="https://nuzlocke-analytics.vercel.app/umami.js"></script>
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

<footer>
  <p>
    <a href="https://www.buymeacoffee.com/nuzlocketracker"
       rel=noreferrer target=_blank>
      <button aria-label='Support me' title='Supprt me'>
        <Icon className='fill-current' src={Coffee} />
      </button>
    </a>
    <a href="https://github.com/domtronn/dc-nuzlocke/issues/new?assignees=&labels=&template=bug_report.md&title="
       rel=noreferrer target=_blank>
      <button aria-label='Report bugs' title='Report bugs'>
        <Icon className='fill-current' src={GitHub} />
      </button>
    </a>
    <a href="https://discord.gg/gtdceegtYB"
       rel=noreferrer target=_blank>
      <button aria-label='Discuss & follow new features' title='Discuss & follow new features'>
        <Icon className=' fill-current' src={Discord} />
      </button>
    </a>

  </p>


  <span class='inline-flex items-center mb-2'>Made with <Icon src={Heart} className='mx-1 fill-current text-red-500' /> by<strong class=ml-1>Domtronn</strong></span>
  <br />
  All content & design © Pokémon Nuzlocke Tracker, 2021-{(new Date()).getFullYear()}. <a href='/privacy-policy'>Privacy Policy</a>.
  <br class='hidden md:block' />
  Pokémon images & names © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM
</footer>
