<script>
  export let location,
    locationName = '',
    type = '',
    infolink = ''

  // Modular component parts
  import HiddenGrass from './HiddenGrass.svelte'
  import ContextMenu from './ContextMenu.svelte'
  import SelectorSettings from './SelectorSettings.svelte'

  import NatureItem from './ACItemNature.svelte'
  import StatusItem from './ACItemStatus.svelte'
  import PokemonItem from './ACItemPokemon.svelte'

  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates } from '$lib/data/states'
  import { AutoComplete, Input } from '$lib/components/core'

  import { Icon } from '$c/core'
  import { onMount, getContext } from 'svelte'

  // Search text bindings for ACs
  export let selected, nickname, status, nature, hidden
  let search, statusSearch, natureSearch

  export let encounters = []
  let encounterItems = []

  const { getAllPkmn, getPkmn, getPkmns } = getContext('game')
  onMount(() => {
    getPkmns(encounters).then(
      (e) =>
        (encounterItems = (encounters || [])
          .map((id) => e[id])
          .filter((i) => i))
    )

    if (status) status = NuzlockeStates[status]
    if (nature) nature = NaturesMap[nature]
    if (selected)
      getPkmn(selected || selected.alias).then((res) => (selected = res))
  })

  let dupelines = new Set(),
    misslines = new Set()

  let settings = {
    showNickname: true,
    showSuggestions: true
  }
</script>

<div
  class:lg:grid-cols-8={settings.showNickname}
  class:lg:grid-cols-6={!settings.showNickname}
  class="relative flex grid w-full grid-cols-2 gap-y-3 gap-x-2 md:grid-cols-4 md:gap-y-2 lg:grid-cols-8 lg:gap-y-0"
>
  <span class="location group relative z-50">
    {#if $$slots.location}
      <slot name="location" />
    {:else}
      {location}
    {/if}
  </span>

  {#if selected && (selected.hidden || hidden)}
    <HiddenGrass {...selected} />
  {:else}
    {@const inset = selected ?? '2.4rem'}
    {@const fetchSearch =
      (search && search !== selected.label) || !settings.showSuggestions}

    <AutoComplete
      rounded
      {inset}
      fetch={fetchSearch ? getAllPkmn : null}
      items={fetchSearch ? [] : encounterItems}
      max={fetchSearch ? 16 : encounterItems.length}
      bind:search
      bind:selected
      name="{location} Encounter"
      placeholder="Find encounter"
      className="col-span-2 w-11/12 sm:w-full"
    >
      <PokemonItem
        slot="icon"
        let:selected
        let:iconClass
        {iconClass}
        {selected}
      />

      <PokemonItem
        slot="item"
        let:label
        let:item
        dupelines={settings.missDuplicates ? misslines : dupelines}
        dupes={settings.duplicates}
        {item}
        {label}
      >
        {@html label}
      </PokemonItem>
    </AutoComplete>
  {/if}

  {#if settings.showNickname}
    <Input
      rounded
      bind:value={nickname}
      name="{location} Nickname"
      placeholder="Nickname"
      className="col-span-2 {!selected || hidden || status?.id === 4
        ? 'hidden sm:block'
        : ''}"
    />
  {/if}

  {#if settings.permadeath && status?.id === 5}
    <div
      class="flex h-10 cursor-not-allowed items-center rounded-lg border-2 text-sm text-gray-800 shadow-sm dark:border-gray-600 dark:text-gray-200"
    >
      <Icon inline class="mx-2 fill-current" icon={NuzlockeStates[5].icon} />
      Dead
    </div>
  {:else}
    {@const items = Object.values(NuzlockeStates)}
    {@const inset = status ? '2.4rem' : false}

    <AutoComplete
      wide
      rounded
      {items}
      {inset}
      bind:search={statusSearch}
      bind:selected={status}
      name="{location} Status"
      label="state"
      placeholder="Status"
      className="relative {!selected || hidden
        ? 'hidden sm:block'
        : ''} {status?.id === 4 ? 'col-span-2 sm:col-span-1' : 'col-span-1'}"
    >
      <StatusItem slot="icon" let:selected {selected} />
      <StatusItem slot="item" let:item let:label {item}>
        {@html label}
      </StatusItem>
    </AutoComplete>
  {/if}

  <AutoComplete
    wide
    rounded
    items={Natures}
    max={Natures.length}
    bind:search={natureSearch}
    bind:selected={nature}
    name="{location} Nature"
    placeholder="Nature"
    dropdownClass="-translate-x-1/2 -ml-1 sm:translate-x-0 sm:ml-0"
    className="col-span-1 {!selected || status?.id === 4 || hidden
      ? 'hidden sm:block'
      : ''}"
  >
    <NatureItem let:item let:label slot="item" {item}>
      {@html label}
    </NatureItem>
  </AutoComplete>
</div>
