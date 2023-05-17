<script>
  export let location,
    locationName = '',
    type = '',
    infolink = '',
    team = []

  // Modular component parts
  import HiddenGrass from './HiddenGrass.svelte'
  import NatureItem from './ACItemNature.svelte'
  import StatusItem from './ACItemStatus.svelte'
  import PokemonItem from './ACItemPokemon.svelte'

  import ContextMenu from './ContextMenu.svelte'
  import Controls from './Controls.svelte'

  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates } from '$lib/data/states'
  import { AutoComplete, Input } from '$lib/components/core'

  import AutoCompleteV2 from '$lib/components/core/AutoCompleteV2.svelte'

  import { Icon } from '$c/core'
  import { onMount, getContext, createEventDispatcher } from 'svelte'

  // Search text bindings for ACs
  export let selected, nickname, status, nature, hidden
  let search, statusSearch, natureSearch

  const dispatch = createEventDispatcher()

  const { getAllPkmn, getPkmn, getPkmns } = getContext('game')

  export let encounters = []
  const encounterF = () =>
    getPkmns(encounters).then((e) =>
      (encounters || []).map((id) => e[id]).filter((i) => i)
    )

  onMount(() => {
    if (status) status = NuzlockeStates[status]
    if (nature) nature = NaturesMap[nature]
    if (selected)
      getPkmn(selected || selected.alias).then((res) => (selected = res))
  })

  $: selected || nickname || status || nature,
    ((_) => {
      dispatch('change', {
        ...(status ? { status: status?.id } : {}),
        ...(selected ? { selected: selected?.alias } : {}),
        ...(nature ? { nature: nature?.id } : {}),
        ...(nickname ? { nickname } : {})
      })
    })()

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
  <span
    class="location group relative z-50 flex items-center gap-x-2 justify-self-end text-right text-sm"
  >
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
      (search && search !== selected?.label) || !settings.showSuggestions}

    <AutoCompleteV2
      {inset}
      max={fetchSearch ? 16 : encounters.length}
      itemF={(_) => (fetchSearch ? getAllPkmn() : encounterF())}
      bind:search
      bind:selected
      name="{location} Encounter"
      placeholder="Find encounter"
      class="col-span-2 w-11/12 sm:w-full"
    >
      <PokemonItem
        slot="icon"
        let:selected
        let:iconClass
        {iconClass}
        {selected}
      />

      <PokemonItem
        slot="option"
        let:label
        let:option
        dupelines={settings.missDuplicates ? misslines : dupelines}
        dupes={settings.duplicates}
        item={option}
        {label}
      />
    </AutoCompleteV2>
  {/if}

  {#if settings.showNickname}
    <Input
      rounded
      bind:value={nickname}
      name="{location} Nickname"
      placeholder="Nickname"
      class="col-span-2 {!selected || hidden || status?.id === 4
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
    {@const inset = status ? '2.4rem' : false}
    {@const itemF = (_) => Object.values(NuzlockeStates)}
    {@const labelF = (item) => item.state}

    <AutoCompleteV2
      {inset}
      {itemF}
      {labelF}
      bind:search={statusSearch}
      bind:selected={status}
      name="{location} Status"
      placeholder="Status"
      class="relative {!selected || hidden
        ? 'hidden sm:block'
        : ''} {status?.id === 4 ? 'col-span-2 sm:col-span-1' : 'col-span-1'}"
    >
      <StatusItem slot="icon" let:selected {selected} />
      <StatusItem slot="option" let:option let:label {option}>
        {@html label}
      </StatusItem>
    </AutoCompleteV2>
  {/if}

  <AutoCompleteV2
    itemF={(_) => Natures}
    max={Natures.length}
    bind:search={natureSearch}
    bind:selected={nature}
    name="{location} Nature"
    placeholder="Nature"
    class="col-span-1 {!selected || status?.id === 4 || hidden
      ? 'hidden sm:block'
      : ''}"
  >
    <NatureItem let:option let:label slot="option" {option}>
      {@html label}
    </NatureItem>
  </AutoCompleteV2>

  <div class="inline-flex gap-x-2 text-left">
    <Controls
      {team}
      pokemon={typeof selected === 'object' ? { ...selected, status } : null}
      inteam={team.includes(location || locationName)}
      on:moncapture
      on:monkill
      on:monevolve
      on:teamrem
      on:teamadd
    />

    <ContextMenu
      {type}
      {infolink}
      {team}
      inteam={team.includes(location || locationName)}
      pokemon={typeof selected === 'object' ? { ...selected, status } : null}
      title={location || locationName}
      on:locnew
      on:lochide
      on:locdelete
      on:moncapture
      on:monkill
      on:monevolve
      on:teamadd
      on:teamrem
      on:clear
    />
  </div>
</div>
