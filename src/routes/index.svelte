<script>
  let value = `--1|Red
charizard|48|fire-spin,flamethrower,fly,dragon-dance|blaze|fire-gem
pikachu|50|volt-tackle,nuzzle,quick-attack,fake-out|static|light-ball

--2|Boss|dark
`
  import PokemonData from 'pokemon-assets/assets/data/pokemon.json'
  import _MovesData from 'pokemon-assets/assets/data/moves.json'
  import _AbilityData from 'pokemon-assets/assets/data/abilities.json'
  import _ItemData from 'pokemon-assets/assets/data/items.json'

  const AbilityData = Object.values(_AbilityData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
  const MovesData = Object.values(_MovesData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
  const ItemData = Object.values(_ItemData).reduce((ac, it) => ({ ...ac, [it.sprite]: it }), {})

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

  import Error from 'svelte-icons-pack/fa/FaSolidTimesCircle'
  import Success from 'svelte-icons-pack/bi/BiSolidBadgeCheck'

  import Mobile from 'svelte-icons-pack/ai/AiOutlineMobile'
  import Stop from 'svelte-icons-pack/ai/AiOutlineStop'

  import GitHub from 'svelte-icons-pack/bi/BiLogoGithub'
  import Discord from 'svelte-icons-pack/bi/BiLogoDiscord'
  import Info from 'svelte-icons-pack/bi/BiInfoSquare'

  import Camera from 'svelte-icons-pack/bi/BiCamera'
  import Copy from 'svelte-icons-pack/fa/FaClipboard'
  import Clipboard from 'svelte-icons-pack/fa/FaSolidClipboardCheck'

  import { Button, Toast, Picture } from '$lib/components/core'

  const fauxfetch = p => {
    let fauxerrors = [] // Reset list of errors

    const fullP = PokemonData[p.name]
    if (p.name && !fullP)
      fauxerrors.push(`Invalid pokemon: ${p.name}`)
    if (p.level && isNaN(p.level))
      fauxerrors.push(`Invalid level: '${p.level}' must be a number`)

    const fullMoves = (p?.moves || []).map(m => {
      const data = MovesData[m]
      if (!data) {
        fauxerrors.push(`Inalid move: ${m}`)
        return
      }

      return {
        name: data.name,
        damage_class: data.category.toLowerCase(),
        power: data.basePower,
        priority: data.priority,
        type: data.type.toLowerCase()
      }
    })

    const fullAbility = AbilityData[p.ability]
    if (p.ability && !fullAbility) fauxerrors.push(`Invalid ability: ${p.ability}`)

    const fullItem = ItemData[p.held]
    if (p.held && !fullItem) fauxerrors.push(`Invalid item: ${p.held}`)

    let err = fauxerrors.length ? fauxerrors : null

    if (!fullP) return [err] // Exit early

    return [
      err,
      {
        ...fullP,
        ...p,
        level: p.level ? isNaN(p.level) ? '??' : p.level : '',
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fullP.num}.png`,
        held: fullItem ? { name: fullItem.name, effect: '...', sprite: fullItem.sprite } : '',
        ability: fullAbility ? { name: fullAbility.name } : '',
        stats: fullP.baseStats,
        types: fullP.types.map(i => i.toLowerCase()),
        maxStat: Math.max(...Object.values(fullP.baseStats)),
        moves: fullMoves.filter(i => !!i)
      }
    ]
  }

  const nonnull = (o = {}) => Object.fromEntries(Object.entries(o).filter(([, val]) => !!val))
  const parseleader = l => {
    const [id, name, speciality, img] = l.replace(/#.*$/g, '').slice(2).trim().split('|')
    return [id, { [id]: nonnull({ name, speciality, img, pokemon: [] })}]
  }

  const parsepokemon = l => {
    const [name, level, moves = '', ability, held, starter] = l.split('|')
    return nonnull({ name, level, moves: moves.split(',').filter(i => i.length), ability, held, starter })
  }

  const parse = data => {
    if (!data) return {}

    let currScope

    return data
    .split('\n')
    .reduce((acc, it) => {
      if (!it.trim().length || it.startsWith('#')) return acc // ignore blank lines and comments
      if (it.startsWith('--')) {
        const [id, data] = parseleader(it)
        currScope = id
        return { ...acc, ...data }
      }

      if (!acc[currScope]) return acc

      return {
        ...acc,
        [currScope]: {
          ...acc[currScope],
          pokemon: acc[currScope]?.pokemon.concat(
            parsepokemon(it)
          )
        }
      }

    }, {})
  }

  let toast
  const oncopy = _ => {
    window
      .navigator
      .clipboard
      .writeText(value)
      .then(_ => toast.toast({
        variant: 'success',
        content: 'Data copied to clipboard',
        icon: Clipboard
      }))
  }

  const onscreenshot = async _ => {
    toast.toast({
      variant: 'failure',
      content: 'Sorry! Screenshots are not currently supported.',
      icon: Camera
    })
  }

  const debouncedError = debounce(_ =>
    errors = Object
      .values(parsed)
      .reduce((acc, boss) => {
        return acc
          .concat(
            boss.pokemon.reduce((acc, p) => {
              const [err] = fauxfetch(p)
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

<div class='block xl:hidden absolute inset-0 flex flex-col items-center justify-center text-2xl text-center px-2 max-w-md mx-auto -mt-12'>
  <div class='relative h-32'>
    <Icon size=4em src={Mobile} className='fill-current absolute text-gray-900 dark:text-gray-50 -translate-x-1/2 left-1/2' />
    <Icon size=6em src={Stop} className='fill-current absolute text-hotpink-500 -translate-x-1/2 left-1/2 -translate-y-6' />
  </div>
  <h4 class='tracking-wide mb-4 text-5xl font-bold'>Screen too small</h4>
  <span class='leading-6 text-lg'>
    The <strong>boss editor</strong> isn't available on smaller devices. You need the room of a desktop browser in order to display everything correctly.
  </span>
  <span class='leading-6 text-lg mt-4'>
    Please open this link again or resize your screen!
  </span>
</div>

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
            <Icon src={Info} className='fill-current translate-y-px'/>
          </mark>
        </button>
        to see detailed instrunctions on the necessary data format.
      </p>
      <p class=mb-6>
        You can submit bosses on
        <a href="https://github.com/domtronn/dc-nuzlocke-data"
           rel=noreferrer target=_blank>
          <mark><Icon src={GitHub} className='fill-current translate-y-px' />GitHub</mark>
        </a>
        or directly on

        <a href="https://discord.com/channels/917869259261100142/917869259776991257"
           rel=noreferrer target=_blank>
          <mark><Icon src={Discord} className='fill-current translate-y-px'/>Discord</mark>
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
            <Icon src={Error} className='fill-current ml-1' />
          </h3>
        {:else}
          <h3 in:fade={{ delay: 75, duration: 150 }} out:fade={{ duration: 150 }}
              class='font-bold text-base text-underline text-green-500 absolute bottom-3 right-4 flex items-center'>
             Valid
            <Icon size=1.4em src={Success} className='fill-current ml-1' />
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
          <Icon size=1.2em src={Copy} className='fill-current mr-2 -ml-2'/>
          Copy to clipboard
          </span>
        </Button>
        <Button disabled on:click={onscreenshot} className='umami--click--screenshot w-full' rounded>
          <span class='inline-flex items-center font-medium -mb-1'>
          <Icon size=1.4em src={Camera} className='fill-current mr-2 translate-y-0.5 -ml-2'/>
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
            {#if fauxfetch(pokemon)[1]}
              <Pokemon {...fauxfetch(pokemon)[1]} />
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
