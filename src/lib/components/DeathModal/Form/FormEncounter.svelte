<script>
  import { slide } from 'svelte/transition'
  import SharedPokemon from './SharedPokemon.svelte'
  import SharedLocation from './SharedLocation.svelte'

  export let pokePlaceholder = 'Wild Pokémon'
  export let locPlaceholder = 'Encounter location'

  export let result = {}
  let ctx = {}

  $: ctx && console.log('encounter ctx', ctx)

  const resetencounter = () => {
    delete ctx.search
    delete ctx.pokemon
  }

  $: result = {
    pokemon: {
      name: ctx?.pokemon?.name,
      id: ctx?.pokemon?.alias,
    },
    location: {
      name: ctx?.location?.name
    }
  }


</script>

<slot name=label />

<SharedLocation
  placeholder={locPlaceholder}
  on:change={resetencounter}
  bind:selected={ctx.location}
/>

{#if ctx?.location}
  <div in:slide>
    <SharedPokemon
      encounters={ctx.location.encounters}
      bind:search={ctx.search}
      bind:selected={ctx.pokemon}
      placeholder={pokePlaceholder}
    />
  </div>
{/if}
