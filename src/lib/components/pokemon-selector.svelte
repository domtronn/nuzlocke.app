<script>
  export let id, store, location, locationName = '', type = '', infolink = ''

  import { read, readdata, patch, removelocation } from '$lib/store'
  import { capitalise } from '$lib/utils/string'

  import { fly } from 'svelte/transition'
  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'
  import { Wrapper as SettingsWrapper } from '$lib/components/Settings'

  import Popover from '$lib/components/core/Popover.svelte'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from 'svelte-icons-pack'
  import Chevron from 'svelte-icons-pack/bi/BiSolidChevronUp'
  import Add from 'svelte-icons-pack/cg/CgAddR'
  import Delete from 'svelte-icons-pack/ri/RiSystemDeleteBack2Line'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'
  import External from 'svelte-icons-pack/ri/RiSystemExternalLinkLine'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Dots from 'svelte-icons-pack/bs/BsThreeDotsVertical'
  import Map from 'svelte-icons-pack/bi/BiMapAlt'
  import Search from 'svelte-icons-pack/bs/BsSearch'

  import { createEventDispatcher, onMount, getContext } from 'svelte'

  let selected, nickname, status, nature, search

  export let encounters = []
  let encounterItems = []

  let Particles, EvoModal
  onMount(() => {
    const [data] = readdata()
    const loc = data[location]
    if (typeof loc?.pokemon !== 'undefined') {
      const o = { ...loc, alias: loc.pokemon, sprite: loc.pokemon, label: capitalise(loc.pokemon) }
      selected = o
    }

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

  $: gray = NuzlockeGroups.Unavailable.includes(status?.id)
</script>

<div class='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-3 md:gap-y-2 lg:gap-y-0 gap-x-2 flex relative w-full sm:w-auto'>
  <span class='group location relative z-50'>
    {#if $$slots.location}
      <slot name=location />
    {:else}
      {location}
    {/if}
  </span>

  <SettingsWrapper id=encounter-suggestions let:setting={suggest}>
    <SettingsWrapper id=dupe-clause let:setting>
      <AutoComplete
        inset={selected ? true : '2.4em'}
        rounded
        fetch={search || !suggest ? getAllPkmn : null}
        items={search || !suggest ? null : encounterItems}
        bind:search
        bind:selected
        name='{location} Encounter'
        placeholder='Find encounter'

        className='col-span-2 w-11/12 sm:w-full'
        >

        <span class='flex items-center h-8 px-4 py-5 md:py-6'
              class:hidden={setting === 2 && evolines.has(item?.evoline)}
              class:dupe={setting === 1 && evolines.has(item?.evoline)}
              slot=item let:item let:label>
          <PIcon name={item?.sprite} className='transform -mb-4 -ml-6 -mt-5 -mr-2' />
          {@html label}
          {#if setting === 1 && evolines.has(item?.evoline)}
            <span class='dupe__span absolute text-tiny right-4'>dupe</span>
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
          {:else}
            <Icon size=0.7em src={Search} className='fill-current left-3 text-gray-500 {iconClass}' />
          {/if}
        </svelte:fragment>
      </AutoComplete>
    </SettingsWrapper>
  </SettingsWrapper>

  <Input
    rounded
    bind:value={nickname}
    name='{location} Nickname'
    placeholder=Nickname
    className='col-span-2 {!selected || status?.id === 4 ? 'hidden sm:block' : ''}'
  />

  <SettingsWrapper id=permadeath on=1 condition={status?.id === 5}>
    <div class='border-2 dark:border-gray-600 shadow-sm rounded-lg h-10 flex items-center text-sm dark:text-gray-200 text-gray-800 cursor-not-allowed'>
      <Icon className='fill-current mx-2' src={NuzlockeStates[5].icon} />
      Dead
    </div>

    <svelte:fragment slot=else>
      <AutoComplete
        wide
        rounded
        items={Object.values(NuzlockeStates)}
        bind:selected={status}
        name='{location} Status'
        placeholder=Status
        label=state
        inset={status ? '2rem' : null}
        className='{!selected ? 'hidden sm:block' : ''} {status?.id === 4 ? 'col-span-2 sm:col-span-1' : 'col-span-1'}'
        >
        <svelte:fragment slot=icon let:iconClass let:selected>
          {#if selected}
            <Icon className='{iconClass} fill-current left-3' src={selected.icon} />
          {/if}
        </svelte:fragment>

        <div class='flex inline-flex gap-x-2 px-3 py-2 md:py-3 items-center' slot=item let:item let:label>
          <Icon src={item.icon} className='fill-current transform md:scale-125' />
          {@html label}
        </div>
      </AutoComplete>
    </svelte:fragment>
  </SettingsWrapper>

  <AutoComplete
    wide
    rounded
    items={Natures}
    bind:selected={nature}
    name='{location} Nature'
    placeholder=Nature
    className='col-span-1 {!selected || status?.id === 4 ? 'hidden sm:block' : ''}'
    dropdownClass='-translate-x-1/2 -ml-1 sm:translate-x-0 sm:ml-0'
  >
    <div class='flex inline-flex justify-between w-full px-5 py-2 md:py-3 -mx-1 items-center' slot=item let:item let:label>
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
    {#if selected && status && status.id !== 4 && status.id !== 5}
      <IconButton
        rounded
        src={Deceased}
        title='Kill {selected.name}'
        containerClassName={!selected ? 'hidden sm:block' : ''}
        on:click={handleStatus(5)}
      />
    {/if}

    {#if selected && !status}
      <IconButton
        rounded
        name=poke-ball
        color=orange
        className=-translate-y-0.5
        containerClassName={!selected ? 'hidden sm:block' : ''}
        on:click={handleStatus(1)}
        title='Capture {selected.name}'
      />
    {/if}

    {#if selected && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
      <IconButton
        rounded
        name=dawn-stone
        className=-translate-y-0.5
        containerClassName={!selected ? 'hidden sm:block' : ''}
        color=green
        title='Evolve {selected.name}'
        on:click={handleEvolution(selected.sprite, selected.evos)}
      />
    {/if}

    <Popover title='Open contextul menu' className='absolute top-16 mt-0.5 right-1 sm:top-0 sm:relative '>
      <Icon size=1.4em src={Dots} className=fill-current />

      <ul in:fly={{ duration: 250, x: 50 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-44 pt-2 flex flex-col divide-y dark:divide-gray-600' slot=popover>
        <strong class='px-4 pb-2 inline-flex justify-between w-full items-center'>
          {locationName || location}
          <Icon src={Map} className=fill-current />
        </strong>

        <li>
          <button on:click={onnew}>
            <Icon src={Add} className='fill-current mr-2'/>
            Add Location
          </button>
        </li>

        <SettingsWrapper id=permadeath on=1 condition={status?.id === 5}>
          <li slot=else>
            <button on:click={handleClear}>
              <Icon src={Delete} className='fill-current mr-2'/>
              Clear Encounter
            </button>
          </li>
        </SettingsWrapper>

        {#if type === 'custom'}
          <li>
            <button on:click={ondelete}>
              <Icon src={Bin} className='fill-current mr-2'/>
              Delete Location
            </button>
          </li>
        {/if}

        {#if selected && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
          <li>
            <button class=inline-flex on:click={handleEvolution(selected.sprite, selected.evos)}>
              <PIcon className='transform scale-75 -mr-2 -ml-1.5 -my-1 grayscale' type='item' name='dawn-stone' />
              <span class=ml-0.5>Evolve {nickname || selected.name}</span>
            </button>
          </li>
        {/if}

        {#if selected && status && status.id !== 4 && status.id !== 5}
          <li>
            <button class=inline-flex on:click={handleStatus(5)}>
              <Icon src={Deceased} className='fill-current mr-2' />
              Kill {nickname || selected.name}
            </button>
          </li>
        {/if}

        {#if selected && !status}
          <li>
            <button class=inline-flex on:click={handleStatus(1)}>
              <PIcon className='transform scale-75 -mr-2 -ml-1.5 -my-1 grayscale' type='item' name='poke-ball' />
              Capture {selected.name}
            </button>
          </li>
        {/if}

        {#if infolink}
          <li>
            <a href={infolink}
               title='Pokémon DB Link for {location}'
               rel=noreferrer target=_blank >
              <Icon src={External} className='fill-current inline -mt-0.5 mr-2' />
              Route Info
            </a>
          </li>
        {/if}
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
  .popover button, .popover a { @apply text-tiny px-4 py-2 transition text-left w-full cursor-pointer; }
  .popover li:hover { @apply text-red-400; }
  .popover li:last-of-type { @apply rounded-b-xl; }
  .popover li, .popover li :global(*) { @apply inline-flex items-center; }

  :global(.dark) ul.popover { @apply text-gray-50; }
  :global(.dark) .popover li:hover { @apply bg-indigo-500 text-white; }
</style>
