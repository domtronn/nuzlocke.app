<script>
  import { fade } from 'svelte/transition'
  import { NuzlockeStates } from '$lib/data/states'

  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'

  export let route, starter, game, filter, bossFilter, search, className = ''
  const { store, key } = game

  let element
  let limit = 10
  const inclimit = _ => limit = limit + 5

  $: filtered = search ? route.filter(r => {
    const item = game.data[r.name]
    return !item
      ? r.name.toLowerCase().includes(search)
      : r.name.toLowerCase().includes(search)
        || item.pokemon?.toLowerCase()?.includes(search) // Search by pokemon name
        || item.nickname?.toLowerCase()?.includes(search) //  Search by nickname
        || NuzlockeStates[item.status]?.state?.toLowerCase()?.includes(search) // Search by status status
  }) : route

</script>

<ul class='flex flex-col gap-y-4 lg:gap-y-2 {className}'>
{#each filtered.slice(0, limit) as p, i (p)}
  {#if p.type === 'route' && [0, 1].includes(filter)}
    {#if store}
      <li id='route-{p.name}' transition:fade>
        <PokemonSelector
          id={i}
          {store}
          location={p.name}
        />
      </li>
    {/if}
  {:else if p.type === 'gym' && [0, 2].includes(filter) && (filter === 0 || bossFilter === 'all' || bossFilter === p.group)}
    <li class='-mb-4 md:my-2' id='boss-{i}' transition:fade>
      <GymCard game={key} starter={starter} id={p.value} location={p.name} />
    </li >
  {/if}

  {#if i === limit - 5}
    <IntersectionObserver {element} on:intersect={inclimit}>
      <li bind:this={element} />
    </IntersectionObserver>
  {/if}
{/each}
</ul>
