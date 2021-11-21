<script>
  export let id, location, store

  import { read, patch } from '$lib/store'

  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from 'svelte-icons-pack'
  import Chevron from 'svelte-icons-pack/bi/BiSolidChevronUp'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'

  import { onMount, getContext } from 'svelte'

  let selected, nickname, status, nature

  let Particles, EvoModal
  onMount(() => {
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)
  })

  const { getAllPkmn, getPkmn } = getContext('game')

  let loading = true
  store.subscribe(read(data => {
    const pkmn = data[location]
    if (!pkmn) return

    status = pkmn.status ? NuzlockeStates[pkmn.status] : null
    nature = pkmn.nature ? NaturesMap[pkmn.nature] : null
    nickname = pkmn.nickname
    if (pkmn.pokemon)
      getPkmn(pkmn.pokemon)
        .then(p => {
          selected = p
          loading = false
        })
  }))

 $: {
   if (selected)
     store.update(patch({
       [location]: {
         id,
         pokemon: selected?.alias,
         status: status?.id,
         nature: nature?.id,
         nickname,
         location
       }
   }))
 }

 function handleClear () {
   status = nickname = selected = null
   store.update(patch({ [location]: {} }))
 }

  let captureComplete = false
  const handleStatus = (sid) => () => {
    if (sid === 1) captureComplete = true
    status = NuzlockeStates[sid]
  }

  const { open } = getContext('simple-modal')
  let evoComplete = false
  const handleSplitEvolution = (base, evolutions) => open(EvoModal, { evolutions, base, select: handleSingleEvolution })
  const handleSingleEvolution = async (id) => getPkmn(id).then(p => {
    selected = p
    evoComplete = true
  })

  const handleEvolution = (base, evos) => async () => handleSplitEvolution(base, evos)

 $: gray = ['Dead', 'Missed'].includes(status?.state)
</script>

<div class='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-3 md:gap-y-2 lg:gap-y-0 gap-x-2 flex'>
  <span class=location>
    {location}
  </span>

  <AutoComplete
    rounded
    fetch={getAllPkmn}
    inset={!!selected}
    bind:selected={selected}
    name='{location} Encounter'
    placeholder=Encounter

    className=col-span-2
  >
    <span class='flex items-center h-8' slot=item let:item let:label>
      <PIcon name={item.sprite} className='transform scale-75 md:scale-100 -mb-4 -ml-6 -mt-5 -mr-2' />
      {@html label}
    </span>

    <svelte:fragment slot=icon let:iconClass>
      {#if selected}
        <div class='absolute left-4 top-2 z-50'>
          {#if evoComplete}
            <Particles icons={['ice-stone', 'dawn-stone', 'fire-stone']} on:end={() => evoComplete = false} />
          {/if}
          {#if captureComplete}
            <Particles icons={['poke-ball', 'friend-ball', 'heavy-ball', 'master-ball']} on:end={() => captureComplete = false} />
          {/if}
        </div>

        <PIcon name={selected.sprite} className='{gray ? 'filter grayscale' : ''} {iconClass}' />
      {/if}
    </svelte:fragment>
  </AutoComplete>

  <Input
    rounded
    bind:value={nickname}
    name='{location} Nickname'
    placeholder=Nickname
    className=col-span-2
  />

  <AutoComplete
    wide
    rounded
    items={Object.values(NuzlockeStates)}
    bind:selected={status}
    name='{location} Status'
    placeholder=Status
    label=state
    inset={status ? '2rem' : null}
    className=col-span-1
  >
    <svelte:fragment slot=icon let:iconClass let:selected>
      {#if selected}
        <Icon className='{iconClass} fill-current left-3' src={selected.icon} />
      {/if}
    </svelte:fragment>

    <div class='flex inline-flex gap-x-2 py-2 items-center' slot=item let:item let:label>
      <Icon src={item.icon} className='fill-current' />
      {@html label}
    </div>
  </AutoComplete>

  <AutoComplete
    wide
    rounded
    items={Natures}
    bind:selected={nature}
    name='{location} Nature'
    placeholder=Nature
    className=col-span-1
    dropdownClass='-translate-x-1/2 -ml-1 sm:translate-x-0 sm:ml-0'
  >
    <div class='flex inline-flex justify-between w-full py-2 -mx-1 items-center' slot=item let:item let:label>
      <span>{@html label}</span>
      {#if item.value.length}
        <span class='flex sm:flex-col -my-4 -mr-3 gap-x-2 sm:gap-x-0 text-tiny sm:gap-y-1'>
          <span class='inline-flex justify-end items-center dark:text-blue-300 text-blue-400'>
            {item.value[0]}
            <Icon src={Chevron} className='fill-current' />
          </span>
          <span class='inline-flex items-center dark:text-orange-300 text-orange-600'>
            {item.value[1]}
            <Icon src={Chevron} className='fill-current transform rotate-180' />
          </span>
        </span>
      {/if}
    </div>
  </AutoComplete>

  <span class='text-left inline-flex gap-x-2'>
    <IconButton
      rounded
      src={Bin}
      title=Clear
      on:click={handleClear}
    />

    {#if selected && status && status.id !== 4 && status.id !== 5}
      <IconButton
        rounded
        src={Deceased}
        title='Kill {selected.name}'
        on:click={handleStatus(5)}
      />
    {/if}

    {#if selected && !status}
      <IconButton
        rounded
        name=poke-ball
        color=orange
        className=-translate-y-0.5
        on:click={handleStatus(1)}
        title='Capture {selected.name}'
      />
    {/if}

    {#if selected && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
      <IconButton
        rounded
        name=dawn-stone
        className=-translate-y-0.5
        color=green
        title='Evolve {selected.name}'
        on:click={handleEvolution(selected.sprite, selected.evos)}
      />
    {/if}

  </span>
</div>

<style>
  .location {
    @apply col-span-2 sm:col-span-1 md:col-span-4 lg:col-span-1 lg:text-right mr-4 sm:text-sm text-lg mt-4 sm:mt-0 h-full font-medium sm:font-normal flex lg:justify-end items-center;
  }
</style>
