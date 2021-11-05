<script>
  export let game, id, location = '', starter = ''
  let pokemon = [], name = '', speciality = '', img

  import { browser } from '$app/env'
  import { fade } from 'svelte/transition'

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'
  import Accordion from '$lib/components/accordion.svelte'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Info from 'svelte-icons-pack/ri/RiEditorAsterisk'

  let loading = true

  const fetchData = async (starter) => {
    if (!browser) return
    try {
      const res = await fetch(`/leader/${game}/${id}.json?starter=${starter}`)
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

  const threshold = -15


  /* TODO: Move all of this logic onto the server */
  $: levelCap = pokemon.reduce((acc, it) => Math.max(acc, it.level), 0)
  $: teamCap = pokemon.length
  $: maxStat = pokemon.reduce((acc, it) => Math.max(acc, Math.max(...Object.values(it.stats))), 0)

  $: atkMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class !== 'status').length, 0)
  $: physMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'physical').length, 0)
  $: specMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'special').length, 0)

  $: aggStats = pokemon.reduce((acc, it, i, arr) => ({
    spdef: (acc.spdef || []).concat(it.stats.spdef),
    def: (acc.def || []).concat(it.stats.def),
    spatk: (acc.spatk || []).concat(it.stats.spatk),
    atk: (acc.atk || []).concat(it.stats.atk),
  }), { spdef: [], def: [], spatk: [], atk: [] })

  $: stats = Object
  .entries(aggStats)
  .map(([key, vals]) => [
    key, {
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: vals.reduce((acc, it) => acc + it, 0) / vals.length
    }
  ])
  .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

  let msg = []
  $: {
    msg = []
    if (stats.def.avg - stats.spdef.avg <= threshold)
      msg.push('Recommend using a Physical attacker since their def is a weakness.')
    else if (stats.spdef.avg - stats.def.avg <= threshold)
      msg.push('Recommend using a Special attacker since their spd is a weakness.')
    else
      msg.push('Recommend using a mixture as their defenses are balanced.')

    if (stats.atk.avg - stats.spatk.avg <= threshold)
      msg.push('Their team is strong Special attackers.')
    else if (stats.spatk.avg - stats.atk.avg <= threshold)
      msg.push('Their team is strong Physical attackers.')
    else
      msg.push('Their team uses mixed attackers.')

    if ((physMoves / atkMoves) > 0.5)
      msg.push(`With most of their attacks being physical (${Math.round(physMoves / atkMoves * 100)}%).`)
    else if ((specMoves / atkMoves) > 0.5)
      msg.push(`With most of their attacks being special (${Math.round(specMoves / atkMoves * 100)}%).`)
  }
</script>

<div class='my-6 relative'>
  <Accordion iconClassName='transition duration-1000 {loading ? 'opacity-0' : 'opacity-100'}'>

    <span
      slot='heading'
      class='text-left inline-flex gap-x-2 h-16 items-center -mt-4'
    >

      {#if img}
        <div class='overflow-hidden max-h-16 w-20 text-center -ml-4 hidden md:block'>
          <img class='inline h-auto w-full' src={img} alt='Gym leader {name}' />
        </div>
      {/if}

      <span class='flex flex-col gap-y-2'>
        <span class='h-6 inline-flex gap-x-2'>
          {#if loading}
            <span class='w-24 animate-pulse bg-gray-400 rounded-md' />
          {:else}
            <h1 class='text-xl font-medium'>{name}</h1>
          {/if}

          {#if speciality}
            <div><TypeBadge type={speciality} /></div>
          {/if}
        </span>

        {#if loading}
          <div class='h-4 w-48 animate-pulse bg-gray-400 rounded-md' />
        {:else if location}
          <h2 class='h-4 text-md font-medium'>
            <span>{location}</span>
          </h2>
        {/if}
      </span>

      <div class='absolute top-0 right-0 inline-flex gap-x-2'>
        {#if loading}
          <div class='h-14 w-14 animate-pulse bg-gray-400 rounded-md' />
          <div class='h-14 w-14 animate-pulse bg-gray-400 rounded-md' />
        {:else}
          <span class='items-center gap-x-2 hidden lg:inline-flex'>
            {#each pokemon as p, i (p.name + i)}
              <PIcon name={p.name} className='-m-4 z-10 relative' />
            {/each}
          </span>
          <span transition:fade data-tooltip={msg.join('\n')}>
            <Icon src={Info} className="fill-current text-gray-400" />
          </span>
          <Label heading='Lvl cap' body={levelCap} />
          <Label heading='Team' body={teamCap} />
        {/if}
      </div>
    </span>

    <div slot='item' class='grid lg:grid-cols-2 md:grid-cols-2 mt-8 gap-x-6 gap-y-10'>
      {#each pokemon as p, i (p.name + i)}
        <Pokemon {...p} maxStat={maxStat} />
      {/each}
    </div>

  </Accordion>
</div>

<style>
  img { image-rendering: pixelated; }
</style>
