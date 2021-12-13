<script>
  export let game, id, location = '', starter = '', type
  let pokemon = [], name = '', speciality = '', img

  import { browser } from '$app/env'
  import { onMount, getContext } from 'svelte'

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'
  import { Picture, PIcon, Accordion } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Badge from 'svelte-icons-pack/fi/FiRefreshCcw'
  import Ball from 'svelte-icons-pack/cg/CgPokemon'

  let CompareModal
  onMount(() =>{
    import('$lib/components/compare')
      .then(i => CompareModal = i.CompareModal)
  })

  const { open } = getContext('simple-modal')

  let loading = true

  const fetchData = async (starter) => {
    if (!browser) return
    try {
      const res = await fetch(`/api/battle/${game}/${id}.json?starter=${starter}`)
      const data = await res.json()

      img = data.img
      pokemon = data.pokemon
      name = data.name
      speciality = data.speciality
      loading = false
    } catch (e) {
      console.error(e)
    }
  }

  $: (async () => await fetchData(starter))()
  $: levelCap = pokemon.reduce((acc, it) => Math.max(acc, it.level), 0)
  $: maxStat = pokemon.reduce((acc, it) => Math.max(acc, Math.max(...Object.values(it.stats))), 0)

</script>

<div class='my-6 relative'>
  <Accordion iconClassName='transition duration-1000 {loading ? 'opacity-0' : 'opacity-100'}'>

    <span
      slot='heading'
      class='text-left inline-flex gap-x-2 h-16 items-center -mt-4'
    >

      {#if img}
        <span class=-mx-3>
          <Picture
            src={img}
            alt={name}
            pixelated
            className='w-18 md:w-36'
            aspect=72x52
            />
        </span>
      {/if}

      <span class='flex flex-col gap-y-2'>
        <span class='h-6 inline-flex gap-x-2'>
          {#if loading}
            <span class='w-20 md:w-24 -ml-9 md:ml-0 animate-pulse bg-gray-400 rounded-md' />
          {:else}
            <h1 class='text-xl font-medium'>{name}</h1>
          {/if}

          {#if speciality}
            <div><TypeBadge type={speciality} /></div>
          {/if}
        </span>

        {#if loading}
          <div class='h-4 w-32 md:w-48 -ml-9 md:ml-0 animate-pulse bg-gray-400 rounded-md' />
        {:else if location}
          <h2 class='h-4 text-md font-medium'>
            <span>{location}</span>
          </h2>
        {/if}
      </span>

      <div class='absolute top-0 right-0 inline-flex gap-x-2'>
        {#if loading}
          <div class='h-14 w-14 animate-pulse bg-gray-400 -mt-2 rounded-md' />
        {:else}
          <span class='items-center gap-x-2 hidden lg:inline-flex'>
            {#each pokemon as p, i (p.name + i)}
              <PIcon name={p.name} className='-m-4 z-10 relative' />
            {/each}
          </span>

          {#if type === 'gym-leader' || type === 'elite-four'}
            <Label heading='Lvl cap' body={levelCap} />
          {/if}
        {/if}
      </div>
    </span>

    <div slot='item' class='grid lg:grid-cols-2 md:grid-cols-2 mt-8 md:gap-x-2 lg:gap-x-6 gap-y-10'>
      {#each pokemon as p, id (p.name + id)}
        <Pokemon {...p} maxStat={maxStat}>
          <button
            class:mt-0={p.moves.length < 3}
            class='umami--click--compare opacity-25 hover:opacity-75 transition mx-8 -mt-4 mb-2 z-50'
            slot=footer
            on:click={_ => open(CompareModal, { pokemon, id: p.name })}
          >
            <span class='absolute w-8 h-8 -mb-2 transform md:scale-75'>
              <Icon className='absolute' size=1.4em src={Badge} />
              <Icon className='absolute dark:bg-gray-800 bg-white rounded-full -top-0.5 right-1.5' size=0.8em src={Ball} />
              <Icon className='absolute dark:bg-gray-800 bg-white rounded-full bottom-2 -left-0.5' size=0.8em src={Ball} />
            </span>
            <span class='ml-8 md:ml-6 md:text-xs'>
              Compare
            </span>
          </button>
        </Pokemon>
      {/each}
    </div>

  </Accordion>
</div>
