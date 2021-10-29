<script>
  import PokemonSelector from '$lib/components/pokemon-selector.svelte'
</script> 

<div class="container mx-auto bg-green-200">
    <div class="flex flex-row flex-wrap h-screen items-center justify-center">
        <main role="main" class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2 bg-gray-50 border border-gray-300 rounded-xl px-8 py-6">
          <PokemonSelector
            location='starter'
            />
        </main>
    </div>
</div>
<footer class="mt-auto">
</footer>
