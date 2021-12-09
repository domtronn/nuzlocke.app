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

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'

  import { fade } from 'svelte/transition'
  import Icon from 'svelte-icons-pack'

  import { Icons, SmallScreen } from '$lib/components/boss-battle'
  import { Button, Toast, Picture } from '$lib/components/core'

  import { parse } from './_parse.js'
  import { fauxfetch } from './_fetch.js'
  
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
    , 200)

  let parsed = {}, errors = []
  $: value, parsed = parse(value)
  $: parsed, debouncedError()
</script>

<svelte:head>
  <link rel=stylesheet href=/assets/items.css />
</svelte:head>

<SmallScreen />

<main class='flex flex-col px-12 pr-6 hidden xl:block'>
  <h1>Boss Editor</h1>

  <div class='w-full flex z-50'>
    <div class='flex flex-col w-1/3 py-4 pr-4'>
      <p>
        This editor lets you build and preview boss battles for the <a class='underline transition hover:text-hotpink-500 dark:hover:text-hotpink-400' rel=external target=blank href='https://nuzlocke.vercel.app'>Nuzlocke Tracker app</a>.
        Use the example above, or click
        <button>
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
        </a>
        .
      </p>

      <div class='shadow-xl rounded-2xl bg-gray-50 dark:bg-gray-900 relative editor'
           class:valid={errors.length === 0}>


      <textarea spellcheck=false bind:value />

      <div class=errors class:valid={!errors.length} >
        {#if errors.length}
          <h3 in:fade={{ delay: 75, duration: 150 }} out:fade={{ duration: 150 }}
              class='absolute bottom-3 right-5 font-bold text-base text-underline flex items-center'>
            {errors.length} Error{errors.length !== 1 ? 's' : ''}
            <Icon src={Icons.Error} className='fill-current ml-1' />
          </h3>
        {:else}
          <h3 in:fade={{ delay: 75, duration: 150 }} out:fade={{ duration: 150 }}
              class='font-bold text-base text-underline text-green-500 absolute bottom-3 right-4 flex items-center'>
             Valid
            <Icon size=1.4em src={Icons.Success} className='fill-current ml-1' />
          </h3>
        {/if}
        {#each (errors || []) as e}
          <p>
            <b>{e.replace(/:.*/, ':')}</b>
            {e.replace(/^.*?:/, '')}
          </p>
        {/each}
      </div>
      </div>

      <span class='mt-4 flex gap-x-2'>
        <Button on:click={oncopy} className='umami--click--export w-full' rounded>
          <span class='inline-flex items-center font-medium'>
          <Icon size=1.2em src={Icons.Copy} className='fill-current mr-2 -ml-2'/>
          Copy to clipboard
          </span>
        </Button>
        <Button disabled on:click={onscreenshot} className='umami--click--screenshot w-full' rounded>
          <span class='inline-flex items-center font-medium -mb-1'>
          <Icon size=1.4em src={Icons.Camera} className='fill-current mr-2 translate-y-0.5 -ml-2'/>
          Take screenshot
          </span>
        </Button>
      </span>
    </div>

    <div class='w-2/3 my-4 overflow-y-scroll pr-6 preview'>
      <div class='preview__grad preview__grad--top -mt-2' />

      <div id=capture class='grid grid-cols-2 gap-x-4 gap-y-8'>
        {#each Object.values(parsed) as boss (boss)}
          <div class='flex w-full gap-x-4 justify-between col-span-2'>
            <div class='flex items-center'>
              <h2>{boss?.name || ''}</h2>
              {#if boss.speciality}
                <TypeBadge type={boss.speciality} />
              {/if}
            </div>
            {#if boss.pokemon.length && boss.pokemon.some(i => +i.level >0)}
              <span class=-mb-6>
                <Label heading='Lvl cap' body={Math.max(... boss.pokemon.map(i => i.level || 0))} />
              </span>
            {/if}
          </div>

          {#each boss.pokemon as pokemon}
            {#if fauxfetch(pokemon, data)[1]}
              <Pokemon {...fauxfetch(pokemon, data)[1]} />
            {/if}
          {/each}
        {/each}
      </div>

      <div class='preview__grad preview__grad--bottom' />
    </div>
  </div>

  <Toast bind:this={toast} />
</main>

<style>
  :root {
    --h: 50vh;
    --max-h: 60vh
  }

  h1 { @apply text-4xl font-bold }
  h2 { @apply text-2xl font-bold mr-2 }

  .preview {
    margin-top: -16px;
    position: relative;
    height: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .editor {
    @apply border-2 border-transparent outline-none hover:ring-0 transition hover:border-hotpink-400 hover:ring-hotpink-400 hover:focus-within:ring-2 focus-within:ring-2 focus-within:border-hotpink-500 focus-within:ring-hotpink-500
  }

  .editor.valid {
    @apply border-2 border-transparent outline-none hover:ring-0 transition hover:border-green-400 hover:ring-green-400 hover:focus-within:ring-2 focus-within:ring-2 focus-within:border-green-500 focus-within:ring-green-500
  }

  :global(.dark) .preview__grad--bottom {
    background: linear-gradient(transparent, theme('colors.gray.800') 50%);
  }
  :global(.dark) .preview__grad--top {
    background: linear-gradient(theme('colors.gray.800') 50%, transparent);
  }

   .preview__grad--top {
    top: 0;
    background: linear-gradient(white 50%, transparent);
  }
  .preview__grad--bottom {
    bottom: 0;
    background: linear-gradient(transparent, white 40%);
  }
  .preview__grad {
    transition: background 1s ease;
    width: 120%;
    position: sticky;
    left: 0;
    height: 24px;
    z-index: 60;
  }

  .preview::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    padding-left: 4px;
  }

  .preview::-webkit-scrollbar-thumb {
    transform: translateX(4px);
    border-radius: 8px;
    background-color: theme('colors.gray.200');
    box-shadow: theme('boxShadow.lg');
  }

  .errors::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
  }

  .errors::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: theme('colors.hotpink.200');
    box-shadow: theme('boxShadow.lg');
  }

  textarea {
    @apply w-full rounded-t-2xl p-4 text-gray-900 text-sm bg-gray-50 overflow-scroll whitespace-nowrap z-10 border-0 outline-none transition;
    resize: none;
    height: var(--h);
  }

  .errors * {
    direction: ltr;
  }
  .errors {
    direction: rtl;
    height: calc(var(--max-h) - var(--h));
    @apply transition p-4 leading-4 text-tiny text-hotpink-500 bg-hotpink-50 rounded-2xl z-0 border-gray-50 border-8 overflow-y-scroll overflow-x-hidden;
  }

  .errors p {
    @apply text-hotpink-500;
  }

  :global(.dark) .errors {
    @apply border-gray-900;
  }

  :global(.dark) .errors p {
    @apply text-hotpink-500;
  }

  :global(.dark) .errors.valid {
    @apply bg-gray-900 border-transparent
  }

  .errors.valid {
    @apply bg-gray-50 border-transparent
  }

  :global(.dark) textarea {
    @apply text-gray-50 bg-gray-900 ;
  }

  p {
    @apply text-sm leading-4 text-gray-900;
  }

  :global(.dark) p {
    @apply text-gray-400;
  }

  mark {
    @apply inline-flex translate-y-px gap-x-1 bg-yellow-200 text-gray-900 px-1
  }

</style>
