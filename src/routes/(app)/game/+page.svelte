<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { fade, slide } from 'svelte/transition'

  import { Loader, Tabs } from '$lib/components/core'

  import { SupportBanner } from '$lib/components/navs'
  import { GameRoute, Search } from '$lib/components/Game'
  import { Settings } from '$lib/components/Settings'

  import SideNav from '$lib/components/navs/SideNav.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Arrow, Hide } from '$icons'

  import { toObj } from '$lib/utils/obj'
  import deferStyles from '$lib/utils/defer-styles'
  import debounce from '$lib/utils/debounce'

  import { Expanded as Games } from '$lib/data/games.js'
  import { getGameStore, read, readdata, readBox,
           savedGames, activeGame, updateGame, parse, patch
         } from '$lib/store'

  let gameStore, gameKey, gameData
  let routeEl

  let search = ''

  $: filter, routeEl && routeEl.resetlimit()

  let filter = 'nuzlocke'
  const filters = [
    { label: 'Nuzlocke', val: 'nuzlocke' },
    { label: 'Routes', val: 'route' },
    { label: 'Bosses', val: 'bosses' },
    { label: 'Upcoming', val: 'upcoming' },
  ]

  let routeFilter = 'all'
  let routeFilters = [
    { label: 'All', val: 'all' },
    { label: 'Upcoming', val: 'upcoming' },
    { label: 'Planned', val: 'planned' },
    { label: 'Missed', val: 'missed' },
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

  onMount(async () => deferStyles('/assets/pokemon.css'))
  onMount(() => {
    parse(saves => {
      if (!browser) return
      let game = saves[$activeGame]
      savedGames.update(updateGame({
        ...game,
        updated: +new Date()
      }))
    })($savedGames)
  })

  let boxData = {}
  const setup = () => new Promise((resolve) => {
    const [, key, id] = readdata()
    if (browser && !id) return window.location = '/'

    gameStore = getGameStore(id)
    gameKey = key

    deferStyles(`/assets/items/${key}.css`)
    fetchRoute(Games[key].pid).then(r => resolve(r))

    gameStore.subscribe(read(game => {
      gameData = game
    }))
  })

  const _onsearch = (e) => search = e.detail.search
  const onsearch = debounce(_onsearch, 350)

  const latestnav = (routes, game) => {
    const custom = (game?.__custom || []).reduce((acc, c) => ({ ...acc, [c.id]: true }), {})
    const locations = new Set(
      Object
        .entries(game)
        .filter(([id, loc]) => loc.pokemon && !!loc.status && !custom[id])
        .map(([, i]) => i.location)
    )

    let i = 0
    while (i < routes.length && (locations.size || routes[i].type !== 'route')) {
      locations.delete(routes[i]?.name)
      i++
    }

    const r = routes[Math.min(i, routes.length - 1)]
    return { ...r, id: i }
  }

  const oncontinue = (route, gameData) => _ => {
    show = !show
    routeEl.setroute(latestnav(route, gameData))()
  }

  let show = false
</script>

<SupportBanner />

{#await setup()}
  <Loader />
{:then route}
  <div id='game_el' out:fade|local={{ duration: 250 }} in:fade|local={{ duration: 250, delay: 300 }} class="container mx-auto pb-24 overflow-hidden">

    <div class="flex flex-row flex-wrap pb-16 justify-center snap-start max-md:pt-4 bg-white dark:bg-gray-800">
      <main id='main' class="p-container md:py-6 flex flex-col gap-y-4 relative ">

          <SideNav
            bind:show={show}
            on:nav={routeEl.setnav}
            route={route}
          >
            <button
              slot='continue'
              class='text-sm underline inline-flex items-center -ml-6 transition-colors dark:hover:text-gray-200 hover:text-black'
              on:click={oncontinue(route, gameData)}
            >
              <Icon inline={true} height='1.2rem' class='fill-current mr-1' icon={Arrow} />
              Continue at {latestnav(route, gameData).name}
            </button>
          </SideNav>

          <div class='flex flex-col gap-y-4 lg:gap-y-0 md:flex-row justify-between items-start md:mb-6'>
            <div class='flex flex-col gap-y-2'>
              {#if filter === 'nuzlocke'}
                <button
                  transition:slide={{ duration: 250 }}
                  class='text-sm inline-flex items-center'
                  on:click={routeEl.setroute(latestnav(route, gameData))}
                >
                  Continue at {latestnav(route, gameData).name}
                  <Icon inline={true} class='ml-1 fill-current' icon={Arrow} />
                </button>
              {/if}

              <Tabs name=filter tabs={filters} bind:selected={filter} />

              {#if filter === 'bosses'}
                <span transition:slide={{ duration: 250 }}>
                  <Tabs name=bosses tabs={bossFilters} bind:selected={bossFilter} />
                </span>
              {/if}

              {#if filter === 'route'}
                <span transition:slide={{ duration: 250 }}>
                  <Tabs name=route tabs={routeFilters} bind:selected={routeFilter} />
                </span>
              {/if}

              {#if filter === 'upcoming'}
                <span transition:slide={{ duration: 250 }} class='leading-5 inline-block tracking-tight dark:text-gray-400 text-sm -mb-4'>
                  <Icon inline={true} height=1.2em icon={Hide} class='inline-block -mt-1 mr-1 fill-current'/><b>{latestnav(route, gameData).id}</b> items hidden
                </span>
              {/if}

            </div>

            <div class=inline-flex>
              <Settings />

              <div class='fixed md:relative bottom-6 md:bottom-0 z-[8888]'>
                <Search on:search={onsearch} />
              </div>
            </div>
          </div>

          <GameRoute
            {route}
            {search}
            filters={{ main: filter, boss: bossFilter, route: routeFilter }}
            bind:this={routeEl}
            className='-mt-8 sm:mt-0'
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
    .container {
      height: calc(100vh - 38px);
      overflow-y: scroll;
    }
  }

  .container {
    min-height: 90vh;
    @apply snap-always snap-y;
  }
</style>
