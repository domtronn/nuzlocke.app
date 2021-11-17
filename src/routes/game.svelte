<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/env'
  import { fade, slide } from 'svelte/transition'

  import IntersectionObserver from "svelte-intersection-observer"

  import { Loader } from '$lib/components/core'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'

  import Tabs from '$lib/components/core/Tabs.svelte'
  import SideNav from '$lib/components/navs/SideNav.svelte'
  import Modal from 'svelte-simple-modal'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiSolidPackage'

  import Games from '$lib/data/games.json'
  import Colors from '$lib/data/colors.json'
  import deferStyles from '$lib/utils/defer-styles'
  import { activeGame, savedGames, getGame, patch, read, parse } from '$lib/store'

  let gameStore, gameKey
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

  const fetchRoute = async (gen) => {
    const res = await fetch(`/api/route/${gen}.json`)
    return await res.json()
  }

  onMount(() => deferStyles('/assets/pokemon.css'))

  const setup = () => new Promise((resolve, reject) => {
    activeGame.subscribe(gameId => {
      if (browser && !gameId) return window.location = '/'

      gameStore = getGame(gameId)
      gameStore.subscribe(read(game => starter = game.__starter || 'fire'))

      savedGames.subscribe(parse(games => {
        gameKey = games[gameId]?.game
        gameId =
          loading = !browser

        deferStyles(`/assets/items/${gameKey}.css`)
        fetchRoute(Games[gameKey].pid)
          .then(r => resolve(r))
      }))
    })
  })

  const setstarter = (e) => {
    starter = e.detail.value
    gameStore.update(patch({ __starter: e.detail.value }))
  }

  const setnav = (e) => {
    limit = Math.max(limit, e.detail.value + 20)
    setTimeout(_ => document.getElementById(`boss-${e.detail.value}`).scrollIntoView({ behavior: 'smooth' }), 50)
  }

  let show = true

</script>

{#await setup()}
  <Loader />
{:then route}
  <div out:fade={{ duration: 250 }} in:fade={{ duration: 250, delay: 300 }} class="container mx-auto pb-8">
    <div class="flex flex-row flex-wrap pb-16 justify-center">
      <Modal
        closeButton={false}
        styleWindow={{ background: 'transparent !important', maxWidth: '320px', width: 'auto' }}
        styleContent={{ padding: '0 !important' }}
      >
        <main id='main' role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 md:py-6 overflow-hidden flex flex-col gap-y-4 relative">
          <SideNav
            bind:show={show}
            on:nav={setnav}
            route={route}
          />


          <div class='flex flex-col gap-y-4 md:gap-y-0 md:flex-row justify-between items-start mb-6'>
            <div class='flex flex-col gap-y-2'>
              <Tabs tabs={filters} bind:selected={filter} />

              {#if filter === 2}
                <Tabs tabs={bossFilters} bind:selected={bossFilter} />
              {/if}
            </div>

            <div class='flex flex-row items-center gap-x-2'>
              <p>Starter</p>
              <StarterType on:select={setstarter} starter={starter} />
            </div>
          </div>

          <ul class='flex flex-col gap-y-4 md:gap-y-2'>
            {#each route.slice(0, limit) as p, i}
              {#if p.type === 'route' && [0, 1].includes(filter)}
                {#if gameStore}
                  <li transition:fade>
                    <PokemonSelector
                      id={i}
                      store={gameStore}
                      location={p.name}
                    />
                  </li>
                {/if}
              {:else if p.type === 'gym' && [0, 2].includes(filter) && (filter === 0 || bossFilter === 'all' || bossFilter === p.group)}
                <li class='-mb-4' id={`boss-${i}`} transition:fade>
                  <GymCard game={gameKey} starter={starter} id={p.value} location={p.name} />
                </li >
              {/if}

              {#if i === limit -5}
                <IntersectionObserver {element} on:intersect={e => limit+=5}>
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
