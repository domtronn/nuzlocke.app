<script>
  import { browser } from '$app/env'
  import { fade } from 'svelte/transition'

  import IntersectionObserver from "svelte-intersection-observer"

  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import Loader from '$lib/components/loader.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiSolidPackage'

  import Games from '$lib/data/games.json'
  import Colors from '$lib/data/colors.json'
  import { activeGame, savedGames, getGame, patch, read, parse } from '$lib/store'

  let gameStore, gameKey
  let loading = true
  let starter = 'fire'
  let element

  let filter = 0
  const filters = [ 'Complete Nuzlocke', 'Route', 'Bosses' ]

  let limit = 20

  const fetchRoute = async (gen) => {
    const res = await fetch(`/route/${gen}.json`)
    return await res.json()
  }

  const setup = () => new Promise((resolve, reject) => {
    activeGame.subscribe(gameId => {
      if (browser && !gameId) return window.location = '/'

      gameStore = getGame(gameId)
      gameStore.subscribe(read(game => starter = game.__starter))

      savedGames.subscribe(parse(games => {
        gameKey = games[gameId]?.game
        loading = !browser

        fetchRoute(Games[gameKey].pid).then(r => resolve(r))
      }))
    })
  })

  const setstarter = (e) => {
    starter = e.detail.value
    gameStore.update(patch({ __starter: e.detail.value }))
  }
</script>

{#await setup()}
  <Loader />
{:then route}
  <div transition:fade class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 md:py-6 overflow-hidden">
        <div class='flex flex-col gap-y-4'>

          <div class='flex flex-col gap-y-4 md:gap-y-0 md:flex-row justify-between mb-6'>
            <div class='order-4 md:order-none flex flex-row gap-x-4'>
              {#each filters as f, i}
                <label
                  class='cursor-pointer transition-colors border-b-2 rounded-none text-md'
                  class:border-transparent={filter !== i}
                  class:border-black={filter === i}
                  class:text-black={filter === i}
                  class:text-gray-500={filter !== i}
                  class:hover:border-gray-300={filter !== i}
                  >
                  <input type=radio bind:group={filter} name='filter' value={i} />
                  {f}
                </label>
              {/each}
            </div>

            <div class='flex flex-row items-center gap-x-2'>
              <p>Starter type</p>
              <StarterType on:select={setstarter} starter={starter} />
            </div>
          </div>

          {#each route.slice(0, limit) as p, i}
            {#if p.type === 'route' && [0, 1].includes(filter)}
              {#if gameStore}
                <span transition:fade>
                  <PokemonSelector
                    id={i}
                    store={gameStore}
                    location={p.name}
                    />
                </span>
              {/if}
            {:else if p.type === 'gym' && [0, 2].includes(filter)}
              <span transition:fade>
                <GymCard game={gameKey} starter={starter} id={p.value} location={p.name} />
              </span >
            {/if}
          {/each}

          <IntersectionObserver {element} on:intersect={e => limit+=5}>
            <span bind:this={element} />
          </IntersectionObserver>
        </div>
      </main>
    </div>
  </div>
{/await}

<style>
  input { display: none; }
</style>
