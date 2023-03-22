<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { AutoComplete } from '$c/core'

  import { fetchRoute } from '$utils/fetchers'
  import { readdata } from '$lib/store'
  import Games from '$lib/data/games.json'
  
  const dispatch = createEventDispatcher()
  const onchange = () => dispatch('change', selected)

  import {
    Ruins,
    Stadium,
    Tunnel,
    Shrine,
    City,
    Town,
    Forest,
    Mountain,
    Route,
    Trophy
  } from '$icons'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  
  export let placeholder = 'Encounter location'
  
  export let selected
  let routes = []
  onMount(() => {
    const [, key] = readdata()
    fetchRoute(Games[key].pid)
      .then((data = []) => routes = data.filter(g => g.type === 'gym'))
  }) 
</script>

<AutoComplete
  className='w-full'
  bind:selected
  on:change={onchange}
  items={routes} label=name
  name={placeholder} {placeholder}
  rounded
>
  <span slot=item let:item let:label class='item'>
    <span>{@html label}</span>
    
    <span class='float-right transform scale-150 pointer-events-none'>
      {#if item.name.includes('League')}
        <Icon inline=true icon={Stadium} class='inline' />
      {:else if item.name.includes('Route')}
        <Icon inline=true icon={Route} class='inline' />
      {:else if item.name.includes('Gym')}
        <Icon inline=true icon={Trophy} class='inline' />
      {:else if item.name.includes('City')}
        <Icon inline=true icon={City} class='inline' />
      {:else if item.name.includes('Town')}
        <Icon inline=true icon={Town} class='inline' />
      {:else if item.name.includes('Mt.') || item.name.includes('Mountain')}
        <Icon inline=true icon={Mountain} class='inline' />
        {:else if item.name.includes('Ruins') || item.name.includes('Tower') || item.name.includes('Castle')}
        <Icon inline=true icon={Ruins} class='inline' />
      {:else if item.name.includes('Tunnel') || item.name.includes('Cave')}
        <Icon inline=true icon={Tunnel} class='inline' />
      {:else if item.name.includes('Shrine')}
        <Icon inline=true icon={Shrine} class='inline' />
      {:else if item.name.includes('Forest')}
        <Icon inline=true icon={Forest} class='inline' />
      {/if}
    </span>

  </span>
</AutoComplete>

<style>
  span.item {
    @apply w-full overflow-hidden
    inline-flex justify-between items-center
    text-xs px-3
    h-4 py-4 md:h-8 md:py-5;
  }
</style>
