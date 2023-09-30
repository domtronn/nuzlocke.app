<script>
  import { onMount, afterUpdate } from 'svelte'
  import { browser } from '$app/environment'
  import { fade, slide } from 'svelte/transition'

  import { Loader, Tabs } from '$lib/components/core'

  import { SupportBanner } from '$lib/components/navs'
  import { GameRoute, Search } from '$lib/components/Game'
  import { Settings } from '$lib/components/Settings'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Arrow, Hide } from '$icons'

  import deferStyles from '$lib/utils/defer-styles'
  import debounce from '$lib/utils/debounce'

  import { Expanded as Games } from '$lib/data/games.js'
  import {
    getGameStore,
    read,
    readdata,
    savedGames,
    activeGame,
    updateGame,
    parse
  } from '$lib/store'

  let gameStore, gameKey, gameData
  let routeEl

  let search = ''

  let filter = 'nuzlocke'
  const filters = [
    { label: 'Nuzlocke', val: 'nuzlocke' },
    { label: 'Routes', val: 'route' },
    { label: 'Bosses', val: 'bosses' },
    { label: 'Upcoming', val: 'upcoming' }
  ]

  let routeFilter = 'all'
  let routeFilters = [
    { label: 'All', val: 'all' },
    { label: 'Upcoming', val: 'upcoming' },
    { label: 'Planned', val: 'planned' },
    { label: 'Missed', val: 'missed' }
  ]

  let bossFilter = 'all'
  const bossFilters = [
    { label: 'All', val: 'all' },
    { label: 'Gym leaders', val: 'gym-leader' },
    { label: 'Elite Four', val: 'elite-four' },
    { label: 'Rival fights', val: 'rival' },
    { label: 'Evil team', val: 'evil-team' }
  ]

  let route
  const fetchRoute = async (gen) => {
    if (route) return route
    const res = await fetch(`/api/route/${gen}.json`)
    route = await res.json()
    return route
  }

  onMount(() => {
    parse((saves) => {
      if (!browser) return
      let game = saves[$activeGame]
      if (!game.id) return
      savedGames.update(
        updateGame({
          ...game,
          updated: +new Date()
        })
      )
    })($savedGames)
  })

  afterUpdate(() => {
    deferStyles(`/assets/items/${gameKey}.css`)
  })

  const setup = () =>
    new Promise((resolve) => {
      console.time('setup')
      const [, key, id] = readdata()
      if (browser && !id) return (window.location = '/')

      gameStore = getGameStore(id)
      gameKey = key

      fetchRoute(Games[key].pid).then((r) => {
        console.timeEnd('setup')
        resolve(r)
      })

      gameStore.subscribe(
        read((game) => {
          console.timeLog('setup')
          gameData = game
        })
      )
    })

  const _onsearch = (e) => (search = e.detail.search)
  const onsearch = debounce(_onsearch, 350)

  const latestnav = (routes, game) => {
    const custom = (game?.__custom || []).reduce(
      (acc, c) => ({ ...acc, [c.id]: true }),
      {}
    )
    const locations = new Set(
      Object.entries(game)
        .filter(([id, loc]) => loc.pokemon && !!loc.status && !custom[id])
        .map(([, i]) => i.location)
    )

    let i = 0
    while (
      i < routes.length &&
      (locations.size || routes[i].type !== 'route')
    ) {
      locations.delete(routes[i]?.name)
      i++
    }

    const r = routes[Math.min(i, routes.length - 1)]
    return { ...r, id: i }
  }
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Game</title>
</svelte:head>

<SupportBanner />

{#await setup()}
  <Loader />
{:then route}
  <div
    id="game_el"
    out:fade|local={{ duration: 250 }}
    in:fade|local={{ duration: 250, delay: 300 }}
    class="container mx-auto overflow-hidden pb-24"
  >
    <div class="flex snap-start flex-row flex-wrap justify-center pb-16">
      <main
        id="main"
        class="p-container relative flex flex-col gap-y-4 md:py-6"
      >
        <div
          class="flex snap-y snap-start snap-always flex-col items-start justify-between gap-y-4 pt-14 md:mb-6 md:flex-row md:pt-14 lg:gap-y-0"
        >
          <div class="flex w-full flex-col gap-y-2">
            {#if filter === 'nuzlocke'}
              <button
                transition:slide={{ duration: 250 }}
                class="inline-flex items-center text-sm"
                on:click={routeEl.setroute(latestnav(route, gameData))}
              >
                Continue at {latestnav(route, gameData).name}
                <Icon inline={true} class="ml-1 fill-current" icon={Arrow} />
              </button>
            {/if}

            <Tabs name="filter" tabs={filters} bind:selected={filter} />

            {#if filter === 'bosses'}
              <span transition:slide={{ duration: 250 }}>
                <Tabs
                  name="bosses"
                  tabs={bossFilters}
                  bind:selected={bossFilter}
                />
              </span>
            {/if}

            {#if filter === 'route'}
              <span transition:slide={{ duration: 250 }}>
                <Tabs
                  name="route"
                  tabs={routeFilters}
                  bind:selected={routeFilter}
                />
              </span>
            {/if}

            {#if filter === 'upcoming'}
              <span
                transition:slide={{ duration: 250 }}
                class="-mb-4 inline-block text-sm leading-5 tracking-tight dark:text-gray-400"
              >
                <Icon
                  inline={true}
                  height="1.2em"
                  icon={Hide}
                  class="-mt-1 mr-1 inline-block fill-current"
                /><b>{latestnav(route, gameData).id}</b> items hidden
              </span>
            {/if}
          </div>

          <div class="inline-flex">
            <Settings />

            <div class="fixed bottom-6 max-md:z-[8888] md:relative md:bottom-0">
              <Search on:search={onsearch} />
            </div>
          </div>
        </div>

        <GameRoute
          {route}
          {search}
          filters={{ main: filter, boss: bossFilter, route: routeFilter }}
          bind:this={routeEl}
          className="-mt-8 sm:mt-0"
          game={{ data: gameData, store: gameStore, key: gameKey }}
          progress={latestnav(route, gameData).id}
        />
      </main>
    </div>
  </div>
{/await}

<style lang="postcss">
  :global(html, body) {
    @apply max-md:overflow-hidden;
  }

  @media (max-width: theme('screens.md')) {
    .container ~ :global(footer) {
      display: none;
    }

    .container {
      height: 100vh;
      overflow-y: scroll;
    }
  }

  .container {
    min-height: 100%;
    @apply snap-y snap-always;
  }
</style>
