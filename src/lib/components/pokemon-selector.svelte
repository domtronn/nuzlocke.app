<script>
  export let id, store, location, locationName = '', type = ''

  import { read, readdata, patch, removelocation } from '$lib/store'

  import { fly } from 'svelte/transition'
  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'

  import Popover from '$lib/components/core/Popover.svelte'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from 'svelte-icons-pack'
  import Chevron from 'svelte-icons-pack/bi/BiSolidChevronUp'
  import Add from 'svelte-icons-pack/cg/CgAddR'
  import Delete from 'svelte-icons-pack/ri/RiSystemDeleteBack2Line'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Dots from 'svelte-icons-pack/bs/BsThreeDotsVertical'
  import Map from 'svelte-icons-pack/bi/BiMapAlt'

  import { createEventDispatcher, onMount, getContext } from 'svelte'

  let selected, nickname, status, nature, search

  export let encounters = []
  let encounterItems = []

  let Particles, EvoModal
  onMount(() => {
    const [data] = readdata()
    selected = data[location]?.pokemon ? data[location] : null
    getPkmns(encounters)
      .then(e => encounterItems = (encounters || []).map(id => e[id]).filter(i => i))
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)
  })

  const { getAllPkmn, getPkmn, getPkmns } = getContext('game')
  const dispatch = createEventDispatcher()

  let loading = true
  let evolines = new Set()
  store && store.subscribe(read(data => {
    getPkmns(
      Object
        .values(data)
        .filter(p => p && (!p.status || NuzlockeGroups.Dupes.includes(p?.status)))
        .map(p => p.pokemon)
        .filter(i => i)
    ).then(p => evolines = new Set(Object.values(p).map(p => p?.evoline)))

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
         location: locationName || location,
         nickname,
       }
   }))
  }

  const onnew = () => dispatch('new', { id })
  const ondelete = () => {
    if (selected &&
        !confirm(`You are about to delete a custom location - this will also delete your Pokémon, ${selected.name}. Are you sure you wish to continue?`))
      return

    handleClear()
    dispatch('delete', { id: location })
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
  <span class='group location relative z-50'>
    {#if $$slots.location}
      <slot name=location />
    {:else}
      {location}
    {/if}
  </span>

  <AutoComplete
    rounded
    fetch={search ? getAllPkmn : null}
    items={search ? null : encounterItems}
    inset={!!selected}
    bind:search
    bind:selected
    name='{location} Encounter'
    placeholder=Encounter

    className=col-span-2
  >
    <span class='flex items-center h-8' class:dupe={evolines.has(item?.evoline)} slot=item let:item let:label>
      <PIcon name={item?.sprite} className='transform scale-75 md:scale-100 -mb-4 -ml-6 -mt-5 -mr-2' />
      {@html label}
      {#if evolines.has(item?.evoline)}
        <span class='dupe__span absolute right-0'>dupe</span>
      {/if}
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
    className='col-span-2 {!selected ? 'hidden sm:block' : ''}'
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
    className='col-span-1 {!selected ? 'hidden sm:block' : ''}'
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
    className='col-span-1 {!selected ? 'hidden sm:block' : ''}'
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

  <span class='text-left inline-flex gap-x-2 {!selected ? 'hidden sm:block' : ''}'>

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

  <Popover title='Open contextul menu'>
    <Icon size=1.4em src={Dots} className=fill-current />

    <ul in:fly={{ duration: 250, x: 50 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-44 pt-2 flex flex-col divide-y dark:divide-gray-600' slot=popover>
      <strong class='px-4 pb-2 inline-flex justify-between w-full items-center'>
        {locationName || location}
        <Icon src={Map} className=fill-current />
      </strong>

      <li>
        <button on:click={onnew}>
          <Icon src={Add} className='fill-current mr-1 -mt-1'/>
          Add Location
        </button>
      </li>

      <li>
        <button on:click={handleClear}>
          <Icon src={Delete} className='fill-current mr-1 -mt-1'/>
          Clear Location
        </button>
      </li>

      {#if type === 'custom'}
        <li>
          <button on:click={ondelete}>
            <Icon src={Bin} className='fill-current mr-1 -mt-1'/>
            Delete Location
          </button>
        </li>
      {/if}
      <!-- TODO: <button><li><Icon src={Bin} className='fill-current mr-1 -mt-1'/>Evolve</li></button> -->
      <!-- <button on:click={handleStatus(5)}><li><Icon src={Deceased} className='fill-current mr-1 -mt-1'/>Kill</li></button> -->
      <!-- <button on:click={handleStatus(1)}><li>Capture</li></button> -->
    </ul>
  </Popover>

  </span>

</div>

<style>
  .dupe {
    @apply opacity-25 grayscale mr-2 text-tiny;
  }

  .location {
    @apply col-span-2 sm:col-span-1 md:col-span-4 lg:col-span-1 lg:text-right mr-4 sm:text-sm text-lg mt-4 sm:mt-0 h-full font-medium sm:font-normal flex lg:justify-end items-center;
  }

  ul.popover { @apply text-gray-800; }
  .popover button { @apply text-tiny px-4 py-2 transition text-left w-full cursor-pointer; }
  .popover li:hover { @apply text-red-400; }
  .popover li:last-of-type { @apply rounded-b-xl; }
  .popover li, .popover li :global(*) { @apply inline; }

  :global(.dark) ul.popover { @apply text-gray-50; }
  :global(.dark) .popover li:hover { @apply bg-indigo-500 text-white; }
</style>
