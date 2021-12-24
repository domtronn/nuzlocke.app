<script>
  import { Tooltip } from '$lib/components/core'
  export let pokemon
</script>

<span class='text-tiny flex gap-x-1'>
  Lvl

  <strong>{pokemon.level}</strong>

  {#if pokemon.ability}
    <strong class:cursor-help={pokemon.ability?.effect}>
      {pokemon.ability.name}
      {#if pokemon.ability.effect}
        <span class=-ml-1>*</span>
        <Tooltip>
          {pokemon.ability.effect}
        </Tooltip>
      {/if}
    </strong>
  {/if}
</span>
