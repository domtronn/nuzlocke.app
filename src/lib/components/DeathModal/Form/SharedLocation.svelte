<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { AutoComplete } from '$c/core'

  import { fetchRoute } from '$utils/fetchers'
  import { readdata } from '$lib/store'
  import { Expanded as Games } from '$lib/data/games.js'

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

  export let placeholder = 'Encounter location',
    route = 'gym'
  
  export let selected
  let routes = []
  onMount(() => {
    const [, key] = readdata()

    fetchRoute(Games[key].pid).then((data = []) => {
      let seen = new Set()
      return (routes = data.filter((g) => {
        if (g.name === 'Starter') return false

        if (seen.has(g.name)) return false
        seen.add(g.name)

        if (route === 'any') return true
        else return g.type === route
      }))
    })
  })
</script>

<AutoComplete
  class="w-full"
  bind:selected
  on:change={onchange}
  itemF={(_) => routes}
  labelF={(_) => _.name}
  name={placeholder}
  {placeholder}
>
  <span slot="option" let:option={item} let:label class="item">
    <span>{@html label}</span>

    <span class="pointer-events-none float-right scale-150 transform">
      {#if item.name.includes('League')}
        <Icon inline="true" icon={Stadium} class="inline" />
      {:else if item.name.includes('Route')}
        <Icon inline="true" icon={Route} class="inline" />
      {:else if item.name.includes('Gym')}
        <Icon inline="true" icon={Trophy} class="inline" />
      {:else if item.name.includes('City')}
        <Icon inline="true" icon={City} class="inline" />
      {:else if item.name.includes('Town')}
        <Icon inline="true" icon={Town} class="inline" />
      {:else if item.name.includes('Mt.') || item.name.includes('Mountain')}
        <Icon inline="true" icon={Mountain} class="inline" />
      {:else if item.name.includes('Ruins') || item.name.includes('Tower') || item.name.includes('Castle')}
        <Icon inline="true" icon={Ruins} class="inline" />
      {:else if item.name.includes('Tunnel') || item.name.includes('Cave')}
        <Icon inline="true" icon={Tunnel} class="inline" />
      {:else if item.name.includes('Shrine')}
        <Icon inline="true" icon={Shrine} class="inline" />
      {:else if item.name.includes('Forest')}
        <Icon inline="true" icon={Forest} class="inline" />
      {/if}
    </span>
  </span>
</AutoComplete>

<style>
  span.item {
    @apply inline-flex h-4
    w-full items-center justify-between
    overflow-hidden px-3
    py-4 text-xs md:h-8 md:py-5;
  }
</style>
