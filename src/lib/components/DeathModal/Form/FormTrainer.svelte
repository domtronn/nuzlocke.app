<script>
  import { Input, AutoComplete } from '$c/core'
  import { fetchTrainers } from '$utils/fetchers'
  import { slide } from 'svelte/transition'

  export let result = {}
  export let classPlaceholder = 'Trainer type'
  export let namePlaceholder = 'Trainer name'
  export let pokePlaceholder = 'Opponent Pokémon'

  let ctx = {}

  // TODO: Fix fetch trainers

  import SharedPokemon from './SharedPokemon.svelte'

  $: result = {
    pokemon: {
      name: ctx?.pokemon?.name,
      id: ctx?.pokemon?.alias,
    },
    trainer: {
      name: ctx?.name,
      type: ctx?.type,
    }
  }

</script>

<slot name=label />

<div class='flex w-full gap-x-2'>
  <AutoComplete
    bind:selected={ctx.type}
    className='flex-2'
    name={classPlaceholder}
    placeholder={classPlaceholder}
    fetch={fetchTrainers.bind({}, 'sw')}
    rounded
    label
  >
    <span slot=item let:label class='inline-flex items-center h-4 md:h-8 px-4 py-4 md:py-5'>
      {@html label}
    </span>
  </AutoComplete>

  <Input
    bind:value={ctx.name}
    className='flex-3'
    name={namePlaceholder}
    placeholder={namePlaceholder}
    rounded
  />
</div>

<SharedPokemon
  bind:selected={ctx.pokemon}
  placeholder={pokePlaceholder}
/>
