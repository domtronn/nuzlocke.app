<script context=module>
  export async function load({ fetch, page }) {
    const protocol = page.host.startsWith('localhost') ? 'http' : 'https'
    const res = await fetch(`${protocol}://${page.host}/api/data.json`)
    const data = await res.json()
    return { props: { data } }
  }
</script>

<script>
  export let data

  let value = `--1|Red
charizard|48|fire-spin,flamethrower,fly,dragon-dance|blaze|fire-gem
pikachu|50|volt-tackle,nuzzle,quick-attack,fake-out|static|light-ball

--2|Boss|dark
`

  const debounce = (fn, ms = 0) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };
  
  import { fade } from 'svelte/transition'
  import Icon from 'svelte-icons-pack'

  import { HelpModal, Icons, Preview, Editor, SmallScreen } from '$lib/components/editor'
  import { Button, Toast, Picture } from '$lib/components/core'

  import { parse } from './_parse.js'
  import { fauxfetch } from './_fetch.js'

  import Modal from 'svelte-simple-modal'
  import { modal } from '$lib/store'
  const showModal = _ => modal.set(HelpModal)
  
  let toast
  const oncopy = _ => {
    window
      .navigator
      .clipboard
      .writeText(value)
      .then(_ => toast.toast({
        variant: 'success',
        content: 'Data copied to clipboard',
        icon: Icons.Clipboard
      }))
  }

  const onscreenshot = async _ => {
    toast.toast({
      variant: 'failure',
      content: 'Sorry! Screenshots are not currently supported.',
      icon: Icons.Camera
    })
  }

  const debouncedError = debounce(_ =>
    errors = Object
      .values(parsed)
      .reduce((acc, boss) => {
        return acc
          .concat(
            boss.pokemon.reduce((acc, p) => {
              const [err] = fauxfetch(p, data)
              if (err) return acc.concat(err)
              return acc
            }, [])
          )
      }, [])
    , 500)

  let parsed = {}, errors = []
  $: value, parsed = parse(value)
  $: parsed, debouncedError()
</script>

<svelte:head>
  <link rel=stylesheet href=/assets/items.css />
</svelte:head>

<SmallScreen />

<Modal show={$modal}
       styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
       styleWindow={{ background: 'transparent !important' }}
       styleContent={{ padding: '0 !important' }}
       >
  <main class='flex flex-col px-12 pr-6 hidden xl:block'>
    <h1>Boss Editor</h1>
    
    <div class='w-full flex z-50'>
      
      <Editor
        className='w-1/3 pr-4'
        bind:value
        on:copy={oncopy}
        on:screenshot={onscreenshot}
        {errors}>

        <p>
          This editor lets you build and preview boss battles for the <a class='underline transition hover:text-hotpink-500 dark:hover:text-hotpink-400' rel=external target=blank href='https://nuzlocke.vercel.app'>Nuzlocke Tracker app</a>.
          Use the example below, or click
          <button on:click={showModal}>
            <mark>
              here
              <Icon src={Icons.Info} className='fill-current translate-y-px'/>
            </mark>
          </button>
          to see detailed instrunctions on the necessary data format.
        </p>

        <p class=mb-6>
          You can submit bosses on
          <a href="https://github.com/domtronn/dc-nuzlocke-data"
             rel=noreferrer target=_blank>
            <mark><Icon src={Icons.GitHub} className='fill-current translate-y-px' />GitHub</mark>
          </a>
          or directly on

          <a href="https://discord.com/channels/917869259261100142/917869259776991257"
             rel=noreferrer target=_blank>
            <mark><Icon src={Icons.Discord} className='fill-current translate-y-px'/>Discord</mark>
          </a>.
        </p>

      </Editor>
      
      <Preview
        className='w-2/3 pr-6'
        bosses={parsed}
        {data}
        />
    </div>

    <Toast bind:this={toast} />

  </main>
</Modal>

<style>
  
  h1 { @apply text-4xl font-bold }
  
  p {
    @apply text-sm leading-4 text-gray-900;
  }

  :global(.dark) p {
    @apply text-gray-400;
  }

  mark { @apply inline-flex translate-y-px gap-x-1 bg-yellow-100 text-gray-900 px-1 transition }
  :global(.dark) mark { @apply bg-hotpink-100 }

  :global(.dark) mark:hover { @apply bg-hotpink-400 text-white }
  mark:hover { @apply bg-yellow-200 }

</style>
