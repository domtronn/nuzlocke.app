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

<div class='dark:bg-gray-800 bg-white dark:text-gray-200 px-6 pb-24 md:px-32 py-6 md:py-10 rounded-lg flex flex-col overflow-x-hidden'>
  {#if available.length}
    <div class='text-center mb-8'>
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

    <div class='flex flex-col flex-col-reverse md:flex-col gap-y-4'>
      <div class='md:relative z-50'>
        {#if i !== available.length - 1}
          <button on:click={inc} class=right>
            <PIcon className='-m-2 -ml-6 md:-m-6 -mr-2' name={available[i + 1].pokemon} />
            <Icon size=1.6em src={Arrow} className='fill-current -mr-2 mt-0.5' />
          </button>
        {/if}
        {#if i !== 0}
          <button on:click={dec} class=left>
            <Icon size=1.6em src={Arrow} className='fill-current transform rotate-180 -ml-2 mt-0.5' />
            <PIcon className='-m-2 -mr-6 md:m-6 -ml-2' name={available[i - 1].pokemon} />
          </button>
        {/if}

      <div>
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

      </div>
      <PokemonCard {...pokemon} level={''} maxStat=250 moves={[]}>
        <StatBlock slot=stats max=250 col={ColorMap[pokemon.types[0]]} {...pokemon.stats} compare={available[i].baseStats} />
      </PokemonCard>
    </div>
  {/if}
</div>

<style>
  button {
    @apply absolute bottom-1 my-6 px-5 rounded-full border shadow-md flex flex-row items-center
  }

  :global(.dark) button {
    @apply bg-gray-900 border-0 text-gray-500;
  }

  button.right {
    @apply right-0 -translate-x-1/2
  }

  button.left {
    @apply left-0 translate-x-1/2;
  }

  @media (min-width:theme('screens.sm')) {
    button { @apply top-1/2 -translate-y-1/2; }

    button.right {
      @apply -right-4 translate-x-full
    }

    button.left {
      @apply -left-4 -translate-x-full;
    }
  }

</style>
