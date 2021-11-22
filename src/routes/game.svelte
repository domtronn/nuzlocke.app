<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/env'
  import { fade, slide } from 'svelte/transition'

  import IntersectionObserver from "svelte-intersection-observer"

  import { Loader, Tooltip } from '$lib/components/core'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import ProgressBar from '$lib/components/ProgressBar.svelte'

  import Tabs from '$lib/components/core/Tabs.svelte'
  import SideNav from '$lib/components/navs/SideNav.svelte'
  import Modal from 'svelte-simple-modal'

  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiRightArrowAlt'

  import Games from '$lib/data/games.json'
  import deferStyles from '$lib/utils/defer-styles'
  import { activeGame, savedGames, getGame, patch, read, parse } from '$lib/store'

  let gameStore, gameKey, gameData
  let loading = true
  let starter = 'fire'
  let element

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

  let limit = 10

  let route
  const fetchRoute = async (gen) => {
    if (route) return route
    const res = await fetch(`/api/route/${gen}.json`)
    route = await res.json()
    return route
  }

  onMount(async () => deferStyles('/assets/pokemon.css'))

  const setup = () => new Promise((resolve) => {
    activeGame.subscribe(gameId => {
      if (browser && !gameId) return window.location = '/'

      gameStore = getGame(gameId)
      gameStore.subscribe(read(game => {
        gameData = game
        starter = game.__starter || 'fire'
      }))

      savedGames.subscribe(parse(games => {
        gameKey = games[gameId]?.game
        gameId =
          loading = !browser

        deferStyles(`/assets/items/${gameKey}.css`)
        fetchRoute(Games[gameKey].pid).then(r => resolve(r))
      }))
    })
  })

  const setstarter = (e) => {
    starter = e.detail.value
    gameStore.update(patch({ __starter: starter }))
  }

  const setnav = (e) => setloc(`boss-${e.detail.value}`, e.detail.value + 20)
  const setroute = ({ name, id }) => () => setloc(`route-${name}`, id + 10)
  const setloc = (id, i) => {
    limit = Math.max(limit, i + 20)
    setTimeout(() => document.getElementById(id).scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const latestnav = (routes, game) => {
    const locations = new Set(
      Object
        .values(game)
        .filter(i => i.pokemon)
        .map(i => i.location)
    )

    let i = 0
    while (locations.size || routes[i].type !== 'route') {
      locations.delete(routes[i].name)
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
  <div out:fade={{ duration: 250 }} in:fade={{ duration: 250, delay: 300 }} class="container mx-auto pb-8 overflow-hidden">
    <div class="flex flex-row flex-wrap pb-16 justify-center">
      <Modal
        closeButton={false}
        styleWindow={{ background: 'transparent !important', width: 'fit-content' }}
        styleContent={{ padding: '0 !important' }}
      >
        <main id='main' role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 md:py-6 flex flex-col gap-y-4 relative">
          <SideNav
            bind:show={show}
            on:nav={setnav}
            on:continue={setroute(latestnav(route, gameData))}
            route={route}
          >
            <button
              slot='continue'
              class='umami--click--continue text-sm underline inline-flex items-center -ml-6 transition-colors dark:hover:text-gray-200 hover:text-black'
              on:click={setroute(latestnav(route, gameData))}
            >
              <Icon size='1.2rem' className='fill-current mr-1' src={Arrow} />
              Continue at {latestnav(route, gameData).name}
            </button>
          </SideNav>

          <span class='absolute top-6 left-0 z-50 text-center w-full mx-auto'>
            <ProgressBar
              segments={
              route
              .filter(r => r.type === 'gym')
              .map(({ value, group }) => ({ type: group, value: gameData[value]?.value || false }))
              }
              />
          </span>

          <div class='flex flex-col gap-y-4 lg:gap-y-0 md:flex-row justify-between items-start mb-6'>
            <div class='flex flex-col gap-y-2'>
              {#if [0, 1].includes(filter)}
                <button
                  transition:slide={{ duration: 250 }}
                  class='umami--click--continue text-sm inline-flex items-center'
                  on:click={setroute(latestnav(route, gameData))}
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

            <div class='flex flex-row items-center gap-x-2'>
              <Tooltip>Selecting a starter type modifies Rival encounters.</Tooltip>
              <p>Starter</p>
              <StarterType on:select={setstarter} bind:starter={starter} />
            </div>
          </div>

          <ul class='flex flex-col gap-y-4 lg:gap-y-2 -mt-8 sm:mt-0'>
            {#each route.slice(0, limit) as p, i}
              {#if p.type === 'route' && [0, 1].includes(filter)}
                {#if gameStore}
                  <li id='route-{p.name}' transition:fade>
                    <PokemonSelector
                      id={i}
                      store={gameStore}
                      location={p.name}
                    />
                  </li>
                {/if}
              {:else if p.type === 'gym' && [0, 2].includes(filter) && (filter === 0 || bossFilter === 'all' || bossFilter === p.group)}
                <li class='-mb-4 md:my-2' id='boss-{i}' transition:fade>
                  <GymCard
                    game={gameKey}
                    store={gameStore}
                    starter={starter}
                    id={p.value}
                    location={p.name}
                    type={p.group}
                  />
                </li>
              {/if}

              {#if i === limit -5}
                <IntersectionObserver {element} on:intersect={() => limit+=5}>
                  <li bind:this={element} />
                </IntersectionObserver>
              {/if}
            {/each}
          </ul>
        </main>
      </Modal>
    </div>
  </div>
{/await}
