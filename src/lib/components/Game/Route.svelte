<script>
  import { afterUpdate } from 'svelte'
  import { fade } from 'svelte/transition'
  import {
    patch,
    addlocation,
    removelocation,
    hidelocation,
    read
  } from '$lib/store'

  import { toDbLocation } from '$utils/link'
  import { insertList } from '$utils/arr'
  import { shortuuid } from '$utils/uuid'
  import { slugify } from '$utils/string'

  import { Tooltip } from '$lib/components/core'
  import CustomLocation from './CustomLocation.svelte'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'

  import {
    hideRouteF,
    showStarterRoute,
    showRoute,
    showGym,
    showCustom
  } from './_predicates'
  import { filterEntry } from './_filters'

  export let route,
    game,
    filters,
    search,
    progress = '',
    className = ''
  const { store, key, data } = game

  let starter = data.__starter || 'fire'
  let element

  /** Custom route handlers & Empty routes */
  let custom = [],
    hidden = [],
    bossTeamIds = [],
    hideRoute = (_) => false
  store.subscribe(
    read((d) => {
      if (!custom.length && d.__custom?.length) custom = d.__custom
      if (!hidden.length && d.__hidden?.length) hidden = d.__hidden

      bossTeamIds = (d.__teams || []).map((i) => i.id)
      hideRoute = hideRouteF(d)
    })
  )

  const onnewlocation = (e) => {
    const index = e.detail.id + 1
    const loc = { type: 'custom', name: '', id: shortuuid(), index }
    custom = custom.concat(loc)
    store.update(addlocation(loc))
  }

  const ondeletelocation = (e) => {
    const id = e.detail.id
    custom = custom.filter((i) => i.id !== id)
    store.update(removelocation(id))
  }

  const onhidelocation = (e) => {
    const id = e.detail.id
    store.update(hidelocation(id))
  }

  $: filtered = insertList(route, custom).filter(
    filterEntry(filters, search, game.data, progress - 1)
  )

  /** Event Handlers */
  const setstarter = (e) => {
    starter = e.detail.value
    game.store.update(patch({ __starter: starter }))
  }

  let limit = 10
  const inclimit = (_) => (limit = limit + 5)
  export const resetlimit = (_) => (limit = 10)

  export const setnav = (e) =>
    setloc(`boss-${e.detail.value}`, e.detail.value + 20)
  export const setroute =
    ({ name, id }) =>
    () =>
      setloc(`route-${name}`, id + 10)

  let scroll
  const scrollToItem = (id) => {
    const offset = window.innerWidth < 700 ? 38 : 76
    const y =
      document.getElementById(id).getBoundingClientRect().top +
      window.pageYOffset

    window.scrollTo({ top: y - offset, behavior: 'smooth' })
  }

  const setloc = (id, i) => {
    limit = Math.max(limit, i + 20)
    document.getElementById(id) ? scrollToItem(id) : (scroll = id)
  }

  const locid = (p, i) => slugify(`${p.type}-${p.name}-${i}`)

  afterUpdate(() => {
    if (!scroll) return
    setTimeout(scrollToItem.bind({}, scroll))
    scroll = null
  })
</script>

<ul class="flex flex-col gap-y-0 lg:gap-y-2 {className}">
  {#each filtered.slice(0, limit) as p, id (locid(p, id))}
    {#if showStarterRoute(p, filters, hideRoute)}
      <li
        class="flex items-center gap-x-2"
        id="route-{p.name}"
        in:fade
        out:fade={{ duration: 100 }}
      >
        <PokemonSelector
          {id}
          {store}
          encounters={p.encounters}
          type="starter"
          location="Starter"
          locationName="Starter"
          on:new={onnewlocation}
        >
          <div
            slot="location"
            class="-mr-1 flex flex-row-reverse items-center gap-x-2 lg:-ml-6 lg:flex-row"
          >
            <StarterType {key} on:select={setstarter} bind:starter />
            <p>
              Starter* <Tooltip
                >Selecting a starter type modifies Rival encounters.</Tooltip
              >
            </p>
          </div>
        </PokemonSelector>
      </li>
    {:else if showRoute(p, filters, hideRoute)}
      <li
        class="location"
        id="route-{p.name}"
        in:fade
        out:fade={{ duration: 100 }}
      >
        <PokemonSelector
          {id}
          {store}
          infolink={toDbLocation(key, p.name)}
          location={p.name}
          encounters={p.encounters}
          on:hide={onhidelocation}
          on:new={onnewlocation}
        />
      </li>
    {:else if showCustom(p, filters, hideRoute)}
      <li
        class="location flex items-center gap-x-2"
        id="custom-{p.index}"
        in:fade
        out:fade={{ duration: 100 }}
      >
        <PokemonSelector
          type="custom"
          locationName={p.name}
          location={p.id}
          {id}
          {store}
          on:new={onnewlocation}
          on:delete={ondeletelocation}
        >
          <svelte:fragment slot="location">
            <CustomLocation {store} id={p.id} />
          </svelte:fragment>
        </PokemonSelector>
      </li>
    {:else if showGym(p, filters, hideRoute)}
      <li
        class="boss -mb-4 md:my-2"
        id="boss-{id}"
        in:fade
        out:fade={{ duration: 100 }}
      >
        <GymCard
          forceVs
          {starter}
          game={key}
          id={p.value}
          defeated={bossTeamIds.includes(p.value)}
          location={p.name}
          type={p.group}
        />
      </li>
    {/if}

    {#if id === limit - 5}
      <IntersectionObserver {element} on:intersect={inclimit}>
        <li bind:this={element} />
      </IntersectionObserver>
    {/if}
  {/each}
</ul>

<style>
  li {
    scroll-margin-top: 28px;
    @apply snap-start;
  }

  @media (min-width: theme('screens.md')) {
    li.location {
      scroll-margin-top: 32px;
    }
  }
</style>
