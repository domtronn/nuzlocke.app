<script>
  import { slide } from 'svelte/transition'
  import SharedPokemon from './SharedPokemon.svelte'
  import SharedLocation from './SharedLocation.svelte'

  export let pokePlaceholder = 'Wild Pokémon'
  export let locPlaceholder = 'Encounter location'

  export let result = {}
  let ctx = {}

  const resetencounter = () => {
    delete ctx.search
    delete ctx.pokemon
  }

  $: result = {
    pokemon: {
      name: ctx?.pokemon?.name,
      types: ctx?.pokemon?.types,
      id: ctx?.pokemon?.alias
    },
    location: {
      name: ctx?.location?.name
    }
  }
</script>

<slot name="label" />

<SharedLocation
  route="route"
  placeholder={locPlaceholder}
  on:change={resetencounter}
  bind:selected={ctx.location}
/>

<SharedPokemon
  encounters={ctx?.location?.encounters}
  bind:search={ctx.search}
  bind:selected={ctx.pokemon}
  placeholder={pokePlaceholder}
/>
