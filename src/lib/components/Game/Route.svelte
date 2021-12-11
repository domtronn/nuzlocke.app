<script>
  import { fade } from 'svelte/transition'
  import { NuzlockeStates } from '$lib/data/states'
  import { patch } from '$lib/store'

  import { Tooltip } from '$lib/components/core'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'

  export let route, game, filter, bossFilter, search, className = ''
  const { store, key, data } = game

  let starter = data.__starter || 'fire'

  let element
  let limit = 10
  const inclimit = _ => limit = limit + 5

  const routefilter = (s, route) => {
    return route.name?.toLowerCase()?.includes(s)
      || route.boss?.toLowerCase()?.includes(s)
  }

  const pokemonfilter = (s, item) => {
    return item.pokemon?.toLowerCase()?.includes(s) // Search by pokemon name
      || item.nickname?.toLowerCase()?.includes(s) //  Search by nickname
      || NuzlockeStates[item.status]?.state?.toLowerCase()?.includes(s) // Search by status status
  }

  $: filtered = search ? route.filter(r => {
    const item = game.data[r.name]
    const s = search.toLowerCase()
    return !item
      ? routefilter(s, r)
      : routefilter(s, r) || pokemonfilter(s, item)
  }) : route


  const setstarter = (e) => {
    starter = e.detail.value
    game.store.update(patch({ __starter: starter }))
  }

  export const setnav = (e) => setloc(`boss-${e.detail.value}`, e.detail.value + 20)
  export const setroute = ({ name, id }) => () => setloc(`route-${name}`, id + 10)

  const setloc = (id, i) => {
    limit = Math.max(limit, i + 20)
    setTimeout(() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' }), 50)
  }
</script>

<ul class='flex flex-col gap-y-4 lg:gap-y-2 {className}'>
{#each filtered.slice(0, limit) as p, i (p)}
  {#if p.type === 'route' && [0, 1].includes(filter) && p.name.toLowerCase() === 'starter'}
    {#if store}
      <li class='flex items-center gap-x-2' id='route-{p.name}' transition:fade>
        <PokemonSelector
          id={i}
          {store}
          location={p.name}
        >
          <div
            slot=location
            class='flex flex-row-reverse lg:flex-row items-center gap-x-2 lg:-ml-6 -mr-1'
          >
            <StarterType on:select={setstarter} bind:starter />
            <p>
              Starter*
              <Tooltip>Selecting a starter type modifies Rival encounters.</Tooltip>
            </p>
          </div>
        </PokemonSelector>
      </li>
    {/if}
  {:else if p.type === 'route' && [0, 1].includes(filter)}
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
