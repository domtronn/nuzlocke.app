<script>
  import { fade } from 'svelte/transition'
  import { NuzlockeStates } from '$lib/data/states'
  import { patch, addlocation, removelocation, read } from '$lib/store'

  import { insertList } from '$lib/utils/arr'
  import { shortuuid } from '$lib/utils/uuid'

  import { Tooltip } from '$lib/components/core'
  import CustomLocation from './CustomLocation.svelte'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'

  export let route, game, filter, bossFilter, search, className = ''
  const { store, key, data } = game

  let starter = data.__starter || 'fire'

  let element
  let limit = 10

  /** Custom route handlers */
  let custom = []
  store.subscribe(read(d => {
    if (!custom.length && d.__custom?.length) custom = d.__custom
  }))

  const onnewlocation = (e) => {
    const index = e.detail.id + 1
    const loc = { type: 'custom', name: '', id: shortuuid(), index }
    custom = custom.concat(loc)
    store.update(addlocation(loc))
  }

  const ondeletelocation = (e) => {
    const id = e.detail.id
    custom = custom.filter(i => i.id !== id)
    store.update(removelocation(id))
  }

  /** Search filter functions */
  const routefilter = (s, route) => {
    return route.name?.toLowerCase()?.includes(s)
      || route.boss?.toLowerCase()?.includes(s)
      || route.encounters?.some(i => i.toLowerCase().includes(s.toLowerCase()))
  }

  const pokemonfilter = (s, item) => {
    return item.pokemon?.toLowerCase()?.includes(s) // Search by pokemon name
      || item.nickname?.toLowerCase()?.includes(s) //  Search by nickname
      || NuzlockeStates[item.status]?.state?.toLowerCase()?.includes(s) // Search by status status
  }

  $: filtered = insertList(route, custom).filter(r => {
    if (!search) return true
    const item = game.data[r.name]
    const s = search.toLowerCase()

    if (r.type === 'custom') console.log(r)

    return !item
      ? routefilter(s, r)
      : routefilter(s, r) || pokemonfilter(s, item)
  })

  /** Event Handlers */
  const setstarter = (e) => {
    starter = e.detail.value
    game.store.update(patch({ __starter: starter }))
  }

  const inclimit = _ => limit = limit + 5

  export const setnav = (e) => setloc(`boss-${e.detail.value}`, e.detail.value + 20)
  export const setroute = ({ name, id }) => () => setloc(`route-${name}`, id + 10)
  const setloc = (id, i) => {
    limit = Math.max(limit, i + 20)
    setTimeout(() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' }), 50)
  }

  /** Predicates */
  const isStarterRoute = (r, filter) => r.type === 'route' && r.name.toLowerCase() === 'starter' && [0, 1].includes(filter)
  const isRoute = (r, filter) => r.type === 'route' && [0, 1].includes(filter)
  const isCustom = (r, filter) => r.type === 'custom' && [0, 1].includes(filter)
  const isGym = (r, filter) => r.type === 'gym' && [0, 2].includes(filter) && (filter === 0 || bossFilter === 'all' || bossFilter === r.group)
</script>

<ul class='flex flex-col gap-y-4 lg:gap-y-2 {className}'>
  {#each filtered.slice(0, limit) as p, id (p)}
    {#if isStarterRoute(p, filter)}
      {#if store}
        <li class='flex items-center gap-x-2' id='route-{p.name}' in:fade>
          <PokemonSelector {id} {store} encounters={p.encounters} location=Starter locationName=Starter on:new={onnewlocation}>
            <div slot=location class='flex flex-row-reverse lg:flex-row items-center gap-x-2 lg:-ml-6 -mr-1'>
              <StarterType on:select={setstarter} bind:starter />
              <p>Starter* <Tooltip>Selecting a starter type modifies Rival encounters.</Tooltip></p>
            </div>
          </PokemonSelector>
        </li>
      {/if}

    {:else if isRoute(p, filter)}
      {#if store}
        <li id='route-{p.name}' in:fade>
          <PokemonSelector
            {id}
            {store}
            location={p.name}
            encounters={p.encounters}
            on:new={onnewlocation}
            />
        </li>
      {/if}

    {:else if isCustom(p, filter)}
      <li class='flex items-center gap-x-2' id='custom-{p.index}' in:fade>
        <PokemonSelector
          type=custom
          locationName={p.name}
          location={p.id}
          {id} {store}

          on:new={onnewlocation}
          on:delete={ondeletelocation}
        >
          <svelte:fragment slot=location>
            <CustomLocation
              {store}
              value={p.name}
              id={p.id}
              />
          </svelte:fragment>
        </PokemonSelector>
      </li>

    {:else if isGym(p, filter, bossFilter)}
      <li class='-mb-4 md:my-2' id='boss-{id}' in:fade>
        <GymCard game={key} starter={starter} id={p.value} location={p.name} type={p.group} />
      </li >
    {/if}

    {#if id <= limit - 5}
      <IntersectionObserver {element} on:intersect={inclimit}>
        <li bind:this={element} />
      </IntersectionObserver>
    {/if}
  {/each}
</ul>
