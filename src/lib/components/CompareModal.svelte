<script>
  export let pokemon

  import { browser } from '$app/env'

  import { getContext } from 'svelte'
  import { capitalise } from '$lib/utils/string'
  import { activeGame, getGame, read } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import ColorMap from '$lib/data/colors.json'

  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiSolidRightArrow'

  import CompareCard from './CompareCard.svelte'
  import { PIcon } from '$lib/components/core'

  const { getPkmn } = getContext('game')

  $: available = []
  $: def = null
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    getGame(gameId).subscribe(read(data => {
      getPkmn(pokemon.name).then(d => def = d)
      Promise.all(
        Object
          .values(data)
          .filter(i => NuzlockeGroups.Available.includes(i.status))
          .map(p => getPkmn(p.pokemon).then(d => ({ ...p, ...d })))
      ).then(d => available = d)
    }))
  })

  $: i = 0
  const inc = _ => i = Math.min(available.length - 1, i + 1)
  const dec = _ => i = Math.max(0, i - 1)
</script>

<section>
  {#if available.length && def}

    <CompareCard className='mt-12' pokemon={[available[i], def]} />

    <div
      class=flex
      class:justify-end={i === 0}
      class:justify-start={i !== available.length - 1}
      class:justify-between={i < available.length && i > 0}
    >
      {#if i !== 0}
        <button on:click={dec} class='left umami--click--prev-compare'>
          <Icon size=1.2em src={Arrow} className='fill-current transform rotate-180 md:-ml-2 mt-0.5' />
          <PIcon className='-m-2 -mr-8 md:-ml-2 md:-mr-7 md:-my-3' name={available[i - 1].pokemon} />
        </button>
      {/if}

      {#if i !== available.length - 1}
        <button on:click={inc} class='right umami--click--next-compare' >
          <PIcon className='-m-2 -ml-8 md:-mr-4 md:-ml-7 md:-my-3' name={available[i + 1].pokemon} />
          <Icon size=1.2em src={Arrow} className='fill-current -mr-2 md:ml-2 mt-0.5' />
        </button>
      {/if}
    </div>

  {/if}
</section>

<style>
  section { min-width: 100%; }

  button {
    @apply flex bg-white z-50 my-6 px-5 rounded-full border-2 shadow-md flex flex-row items-center border-gray-600 text-gray-600 md:hover:border-indigo-600 md:hover:text-indigo-600 transition
  }

  :global(.dark) button {
    @apply bg-gray-800 border-2 border-gray-600 text-gray-600 md:hover:border-indigo-700 md:hover:text-indigo-800 md:hover:bg-gray-900;
  }

  @media (min-width:theme('screens.sm')) {
    section { min-width: 360px; }
  }

</style>
