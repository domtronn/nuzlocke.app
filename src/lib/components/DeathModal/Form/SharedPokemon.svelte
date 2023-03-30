<script>
  import { AutoComplete, PIcon } from '$c/core'

  import { getContext, onMount } from 'svelte'
  const { getAllPkmn, getPkmns } = getContext('game')

  import { fetchRoute } from '$utils/fetchers'
  import { readdata } from '$lib/store'
  import { Expanded as Games } from '$lib/data/games.js'

  export let placeholder = 'The Pokémon you were facing'
  export let selected, search, encounters

  let routes = []
  onMount(() => {
    const [, key] = readdata()
    fetchRoute(Games[key].pid)
      .then((data = []) => routes = data.filter(g => g.type !== 'gym'))
  })
  
  let items
  $: encounters && encounters.length > 1 && getPkmns(encounters).then(res => items = Object.values(res))
</script>

<AutoComplete
  fetch={search ? getAllPkmn : null}
  items={search ? null : items}
  label=name
  rounded
  className='w-full'
  
  bind:selected
  bind:search
  
  name={placeholder}
  {placeholder}
>
  <span slot=item let:item let:label class='item'>
    <span>{@html label}</span>
    <PIcon
      className='float-right -mr-4'
      name={item.alias}
    />
  </span>
</AutoComplete>

<style>
  span.item {
    @apply w-full overflow-hidden
    inline-flex justify-between items-center
    text-xs px-3
    h-4 py-4 md:h-8 md:py-5;
  }
</style>
