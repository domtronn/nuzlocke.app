<script>
  import { browser } from '$app/env'
  import { fade } from 'svelte/transition'

  import GymCard from '$lib/components/gym-card.svelte'
  import Loader from '$lib/components/loader.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiSolidPackage'

  import Water from 'svelte-icons-pack/io/IoWater'
  import Fire from 'svelte-icons-pack/im/ImFire'
  import Grass from 'svelte-icons-pack/fa/FaSolidLeaf'

  import Games from '$lib/data/progression.json'
  import Colors from '$lib/data/colors.json'
  import { activeGame, savedGames, getGame, patch, read } from '$lib/store'

  let gameStore, game
  let loading = true

  let filter = 0
  const filters = [ 'Combined', 'Nuzlocke route', 'Gyms' ]

  let starter = ''
  const starters = [
    { name: 'fire', icon: Fire },
    { name: 'water', icon: Water },
    { name: 'grass', icon: Grass }
  ]

  activeGame.subscribe(gameId => {
    gameStore = getGame(gameId)
    gameStore.subscribe(read(game => starter = game.__starter))

    savedGames.subscribe(games => {
      const gameKey = games.split(',').map(i => i.split('|')).filter(i => i[0] === gameId)[0][3]
      game = Games[gameKey]
      loading = !browser
    })
  })

  const setstarter = () => setTimeout(_ => gameStore.update(patch({ __starter: starter })) , 1)

</script>

{#if loading || !game}
  <Loader />
{:else}
  <div transition:fade class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 py-6 overflow-hidden">
        <div class='flex flex-col gap-y-4'>
          <h1 class='text-4xl mb-2'>Pokémon {game.title}</h1>

          <div class='flex flex-row justify-between'>
            <div class='flex flex-row gap-x-4'>
              {#each starters as s, i}
                <label
                  class='flex w-6 h-6 p-1.5 items-center justify-center rounded-full grayscale cursor-pointer transition opacity-50 hover:opacity-75 hover:grayscale-0'
                  class:opacity-100={starter === s.name}
                  class:grayscale-0={starter === s.name}
                  style='background-color: {Colors[s.name]};'
                >
                  <input type='radio' on:click={setstarter} bind:group={starter} name='starter' value={s.name} />
                  <Icon src={s.icon} color='white' className='fill-current text-white stroke-white' />
                </label>
              {/each}
            </div>

          <div class='flex flex-row gap-x-4'>
            {#each filters as f, i}
              <label
                class='cursor-pointer transition-colors border-b-2 rounded-none text-md border-transparent'
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

          {#each game.progression as p, i}
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
                    <GymCard game='swsh' starter={starter} id={p.value} location={p.name} />
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
