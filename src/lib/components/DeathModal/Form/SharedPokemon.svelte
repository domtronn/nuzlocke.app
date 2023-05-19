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
    fetchRoute(Games[key].pid).then(
      (data = []) => (routes = data.filter((g) => g.type !== 'gym'))
    )
  })

  const encounterF = (_) =>
    getPkmns(encounters).then((res) => Object.values(res))
</script>

<AutoComplete
  itemF={(_) => (!search && encounters ? encounterF() : getAllPkmn())}
  labelF={(_) => _.name}
  class="w-full"
  bind:selected
  bind:search
  name={placeholder}
  {placeholder}
>
  <span slot="option" let:option={item} let:label class="item">
    <span>{@html label}</span>
    <PIcon className="float-right -mr-4" name={item.alias} />
  </span>
</AutoComplete>

<style>
  span.item {
    @apply inline-flex h-4
    w-full items-center justify-between
    overflow-hidden px-3
    py-4 text-xs md:h-8 md:py-5;
  }
</style>
