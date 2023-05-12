<script>
  import SharedLocation from './SharedLocation.svelte'

  import { Input, AutoComplete } from '$c/core'
  import { readdata } from '$lib/store'
  import { fetchTrainers } from '$utils/fetchers'

  import { slide } from 'svelte/transition'

  export let result = {}
  export let locPlaceholder = 'Encounter location'
  export let classPlaceholder = 'Trainer type'
  export let namePlaceholder = 'Trainer name'
  export let pokePlaceholder = 'Opponent Pokémon'

  let ctx = {}

  import SharedPokemon from './SharedPokemon.svelte'

  $: result = {
    pokemon: {
      name: ctx?.pokemon?.name,
      types: ctx?.pokemon?.types,
      id: ctx?.pokemon?.alias
    },
    location: {
      name: ctx?.location?.name
    },
    trainer: {
      name: ctx?.name,
      type: ctx?.type
    }
  }

  let trainers = []
  const [, key] = readdata()
  $: key && fetchTrainers(key).then((t) => (trainers = t))
</script>

<slot name="label" />

<SharedLocation
  route="any"
  placeholder={locPlaceholder}
  bind:selected={ctx.location}
/>

<div class="flex w-full gap-x-2">
  <AutoComplete
    bind:selected={ctx.type}
    className="flex-2"
    name={classPlaceholder}
    placeholder={classPlaceholder}
    items={trainers}
    rounded
    label
  >
    <span
      slot="item"
      let:label
      class="inline-flex h-4 items-center px-4 py-4 md:h-8 md:py-5"
    >
      {@html label}
    </span>
  </AutoComplete>

  <Input
    bind:value={ctx.name}
    className="flex-3"
    name={namePlaceholder}
    placeholder={namePlaceholder}
    rounded
  />
</div>

<SharedPokemon bind:selected={ctx.pokemon} placeholder={pokePlaceholder} />
