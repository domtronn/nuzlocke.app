<script>
  export let pokemon

  import { browser } from '$app/env'
  import { getContext } from 'svelte'

  import PokemonCard from '$lib/components/pokemon-card.svelte'
  import { activeGame, getGame, read } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import ColorMap from '$lib/data/colors.json'

  import Icon from 'svelte-icons-pack'
  import Badge from 'svelte-icons-pack/fi/FiRefreshCcw'
  import Ball from 'svelte-icons-pack/cg/CgPokemon'
  import Arrow from 'svelte-icons-pack/bi/BiSolidRightArrowCircle'

  import { PIcon } from '$lib/components/core'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { capitalise } from '$lib/utils/string'

  const { getPkmn } = getContext('game')

  $: available = []
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    getGame(gameId).subscribe(read(data => {
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

<section class='dark:bg-gray-800 bg-white dark:text-gray-200 px-6 md:px-32 py-6 md:py-10 rounded-lg flex flex-col overflow-x-hidden'>
  {#if available.length}
    <div class='text-center mb-4 md:mb-8'>
      <h2 class='text-xl font-bold -ml-6'>
        Compare
        <span class='absolute ml-2 w-8 h-8'>
          <Icon className='absolute' size=1.4em src={Badge} />
          <Icon className='absolute dark:bg-gray-800 bg-white rounded-full top-0 right-0.5' size=0.8em src={Ball} />
          <Icon className='absolute dark:bg-gray-800 bg-white rounded-full bottom-1 -left-0.5' size=0.8em src={Ball} />
        </span>
      </h2>
      <h3 class='text-base font-medium'>{available[i].name} vs {capitalise(pokemon.name)}</h3>
    </div>

    <div class='flex flex-col flex-col-reverse md:flex-col'>
      <div class='md:relative z-50 mt-6 md:mt-0 md:mb-6'>
        {#if i !== available.length - 1}
          <button on:click={inc} class='right umami--click--next-compare'>
            <PIcon className='-m-2 -ml-8 md:-m-5 -mr-3' name={available[i + 1].pokemon} />
            <Icon size=1.6em src={Arrow} className='fill-current -mr-2 md:ml-2 mt-0.5' />
          </button>
        {/if}
        {#if i !== 0}
          <button on:click={dec} class='left umami--click--prev-compare'>
            <Icon size=1.6em src={Arrow} className='fill-current transform rotate-180 -ml-2 md:mr-2 mt-0.5' />
            <PIcon className='-m-2 -mr-6 md:-m-5 -ml-3' name={available[i - 1].pokemon} />
          </button>
        {/if}

        {#each [available[i]] as p (p)}
          <PokemonCard
            {...p}
            sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.imgId}.png`}
            moves={[]}
            >
            <StatBlock col={ColorMap[p.types[0]]} slot=stats max=250 compare={pokemon.stats} {...p.baseStats} />
          </PokemonCard>
        {/each}
      </div>

      <PokemonCard {...pokemon} level={''} maxStat=250 moves={[]}>
        <StatBlock slot=stats max=250 col={ColorMap[pokemon.types[0]]} {...pokemon.stats} compare={available[i].baseStats} />
      </PokemonCard>
    </div>
  {/if}
</section>

<style>
  section { min-width: 100%; }

  button {
    @apply fixed bg-white z-50 bottom-0 my-6 px-5 rounded-full border shadow-md flex flex-row items-center hover:border-indigo-200 hover:bg-gray-900 transition
  }

  :global(.dark) button {
    @apply bg-gray-800 border-2 border-gray-300 text-gray-200 hover:border-indigo-700 hover:text-indigo-800 hover:bg-gray-900;
  }

  button.right {
    @apply right-0 -translate-x-1/2
  }

  button.left {
    @apply left-0 translate-x-1/2;
  }

  @media (min-width:theme('screens.sm')) {
    section { min-width: 520px; }

    button { @apply absolute top-1/2 -translate-y-1/2 h-12; }

    button.right {
      @apply -right-4 translate-x-full
    }

    button.left {
      @apply -left-4 -translate-x-full;
    }
  }

</style>
