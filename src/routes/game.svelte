<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/env'
  import { fade, slide } from 'svelte/transition'

  import { Loader, Tooltip, Tabs, Input } from '$lib/components/core'
  import StarterType from '$lib/components/starter-type.svelte'

  import GameRoute from '$lib/components/Game/Route.svelte'
  import Search from '$lib/components/Game/Search.svelte'
  import SideNav from '$lib/components/navs/SideNav.svelte'
  import Modal from 'svelte-simple-modal'

  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiRightArrowAlt'

  import Games from '$lib/data/games.json'
  import deferStyles from '$lib/utils/defer-styles'
  import { activeGame, savedGames, getGame, patch, read, readdata, parse } from '$lib/store'

  let gameStore, gameKey, gameData
  let loading = true
  let routeEl
  let element

  let search = ''

  let filter = 0
  const filters = ['Nuzlocke', 'Routes', 'Bosses']

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

  const setup = () => new Promise((resolve) => {
    const [data, key, id] = readdata()
    if (browser && !id) return window.location = '/'

    gameStore = getGame(id)
    gameData = data
    gameKey = key

    deferStyles(`/assets/items/${key}.css`)
    fetchRoute(Games[key].pid).then(r => resolve(r))
  })

  const latestnav = (routes, game) => {
    const locations = new Set(
      Object
        .values(game)
        .filter(i => i.pokemon)
        .map(i => i.location)
    )

    let i = 0
    while (i < routes.length && (locations.size || routes[i].type !== 'route')) {
      locations.delete(routes[i]?.name)
      i++
    }

    const r = routes[Math.min(i, routes.length - 1)]
    return { ...r, id: i }
  }

  let show = false

</script>

{#await setup()}
  <Loader />
{:then route}
  <div id='game_el' out:fade|local={{ duration: 250 }} in:fade|local={{ duration: 250, delay: 300 }} class="container mx-auto pb-24 overflow-hidden">
    <div class="flex flex-row flex-wrap pb-16 justify-center">
      <Modal
        closeButton={false}
        styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
        styleWindow={{ background: 'transparent !important' }}
        styleContent={{ padding: '0 !important' }}
      >
        <main id='main' role="main" class="w-full sm:w-3/4 px-4 md:px-8 md:py-6 flex flex-col gap-y-4 relative">
          <SideNav
            bind:show={show}
            on:nav={routeEl.setnav}
            route={route}
          >
            <button
              slot='continue'
              class='text-sm underline inline-flex items-center -ml-6 transition-colors dark:hover:text-gray-200 hover:text-black'
              on:click={_ => {
                show = !show
                routeEl.setroute(latestnav(route, gameData))()
              }}
            >
              <Icon size='1.2rem' className='fill-current mr-1' src={Arrow} />
              Continue at {latestnav(route, gameData).name}
            </button>
          </SideNav>

          <div class='flex flex-col gap-y-4 lg:gap-y-0 md:flex-row justify-between items-start mb-6'>
            <div class='flex flex-col gap-y-2'>
              {#if [0, 1].includes(filter)}
                <button
                  transition:slide={{ duration: 250 }}
                  class='text-sm inline-flex items-center'
                  on:click={routeEl.setroute(latestnav(route, gameData))}
                >
                  Continue at {latestnav(route, gameData).name}
                  <Icon className='fill-current' src={Arrow} />
                </button>
              {/if}

              <Tabs name=filter tabs={filters} bind:selected={filter} />

              {#if filter === 2}
                <span transition:slide={{ duration: 250 }}>
                  <Tabs name=bosses tabs={bossFilters} bind:selected={bossFilter} />
                </span>
              {/if}
            </div>

            <div class='fixed md:relative bottom-6 md:bottom-0 md:shadow-none shadow-lg' style='z-index: 4444;'>
              <Search bind:term={search} />
            </div>
          </div>

          <GameRoute
            {route}
            {search}
            {filter}
            {bossFilter}
            bind:this={routeEl}
            className='-mt-8 sm:mt-0'
            game={{ data: gameData, store: gameStore, key: gameKey }}
          />

        </main>
      </Modal>
    </div>
  </div>
{/await}
