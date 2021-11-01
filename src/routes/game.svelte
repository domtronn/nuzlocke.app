<script>
  import { browser } from '$app/env'

  import GymCard from '$lib/components/gym-card.svelte'
  import Loader from '$lib/components/loader.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'

  import Games from '$lib/data/progression.json'
  import { activeGame, savedGames, getGame } from '$lib/store'

  let gameStore, game
  let loading = true
  activeGame.subscribe(gameId => {
    gameStore = getGame(gameId)

    savedGames.subscribe(games => {
      const gameKey = games.split(',').map(i => i.split('|')).filter(i => i[0] === gameId)[0][3]
      game = Games[gameKey]
      loading = !browser
    })
  })

</script>

{#if loading || !game}
  <Loader />
{:else}
  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 py-6">
        <div class='flex flex-col gap-y-4'>
          <h1 class='text-4xl mb-2'>Pokémon {game.title}</h1>

          {#each game.progression as p, i}
            {#if p.type === 'route'}
              {#if gameStore}
                <PokemonSelector
                  id={i}
                  store={gameStore}
                  location={p.name}
                  />
                {/if}
              {:else if p.type === 'gym'}
                <GymCard game='swsh' id={p.value} location={p.name} />
              {/if}

          {/each}
        </div>
      </main>
    </div>
  </div>
{/if}
