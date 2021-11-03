<script>
  import { browser } from '$app/env'
  import { fade } from 'svelte/transition'

  import GameHeading from '$lib/components/game-heading.svelte'
  import StarterType from '$lib/components/starter-type.svelte'
  import GymCard from '$lib/components/gym-card.svelte'
  import Loader from '$lib/components/loader.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiSolidPackage'

  import Routes from '$lib/data/routes.json'
  import Games from '$lib/data/games.json'
  import Colors from '$lib/data/colors.json'
  import { activeGame, savedGames, getGame, patch, read, parse } from '$lib/store'

  let gameStore, gameKey
  let loading = true
  let starter = 'fire'

  let filter = 0
  const filters = [ 'Combined', 'Nuzlocke route', 'Gyms' ]

  activeGame.subscribe(gameId => {
    if (browser && !gameId) return window.location = '/'

    gameStore = getGame(gameId)
    gameStore.subscribe(read(game => starter = game.__starter))

    savedGames.subscribe(parse(games => {
      gameKey = games[gameId]?.game
      loading = !browser
    }))
  })

  const setstarter = (e) => {
    starter = e.detail.value
    gameStore.update(patch({ __starter: e.detail.value }))
  }
</script>

{#if loading || !gameKey}
  <Loader />
{:else}
  <div transition:fade class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 py-6 overflow-hidden">
        <div class='flex flex-col gap-y-4'>

          <GameHeading />

          <div class='flex gap-y-4 flex-wrap flex-row justify-between'>
            <div class='flex flex-row items-center gap-x-2'>
            <p>Starter type</p>
              <StarterType on:select={setstarter} starter={starter} />
            </div>

            <div class='order-4 md:order-none flex flex-row gap-x-4'>
              {#each filters as f, i}
                <label
                  class='cursor-pointer transition-colors border-b-2 rounded-none text-md'
                  class:border-transparent={filter !== i}
                  class:border-black={filter === i}
                  class:text-black={filter === i}
                  class:text-gray-400={filter !== i}
                  class:hover:border-gray-300={filter !== i}
                  >
                  <input type=radio bind:group={filter} name='filter' value={i} />
                  {f}
                </label>
              {/each}
          </div>

          <div>
            <a href='/box' >
              <button class='text-lg inline-flex gap-x-1 items-center'>
                <Icon src={Box} size='1.2em' />
                Box
              </button>
            </a>
          </div>

          </div>

          {#each Routes[Games[gameKey].pid] as p, i}
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
        </div>
      </main>
    </div>
  </div>
{/if}

<style>
  input { display: none; }
</style>
