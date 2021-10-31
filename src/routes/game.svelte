<script>
  import GymCard from '$lib/components/gym-card.svelte'
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import Games from '$lib/data/games.json'
  
  const game = Games.sw
  
</script> 

<div class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-4 md:px-8 py-6">
        <div class='flex flex-col gap-y-4'>
          <h1 class='text-4xl mb-2'>Pokémon {game.title}</h1>
          {#each game.progression as p, i}
            {#if p.type === 'route'}
              <PokemonSelector id={i} location={p.name} />
            {:else if p.type === 'gym'}
              <GymCard game='swsh' id={p.value} />
            {/if}
          {/each}
        </div>
        </main>
    </div>
</div>
