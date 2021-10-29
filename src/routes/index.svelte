<script>
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
  import Games from '$lib/data/games.json'
  
  const game = Games.sw
  
</script> 

<div class="container mx-auto">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
      <main role="main" class="w-full sm:w-2/3 md:w-3/4 bg-gray-50 border border-gray-300 rounded-xl px-8 py-6">
        <div class='flex flex-col gap-y-4'>
          <h1>{game.title}</h1>
          {#each game.progression as p}
            <PokemonSelector location={p.name} />
          {/each}
        </div>
        </main>
    </div>
</div>
<footer class="mt-auto">
</footer>
