<script>
  export let id, store, location, locationName = '', type = '', infolink = ''

  import { read, readdata, patch } from '$lib/store'
  import { capitalise } from '$lib/utils/string'

  import { fly } from 'svelte/transition'
  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'
  import { Wrapper as SettingsWrapper } from '$lib/components/Settings'

  import Popover from '$lib/components/core/Popover.svelte'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Chevron, Add, Delete, Deceased, External, Bin, Dots, Map, Search, LongGrass } from '$icons'

  import { createEventDispatcher, onMount, getContext } from 'svelte'

  let selected, nickname, status, nature, hidden
  let prevstatus = 'loading'

  // Search text bindings for ACs
  let search, statusSearch, natureSearch

  export let encounters = []
  let encounterItems = []

  let Particles, EvoModal, DeathModal
  onMount(() => {
    const [data] = readdata()
    const loc = data[location]
    if (typeof loc?.pokemon !== 'undefined') {
      const o = { ...loc, alias: loc.pokemon, sprite: loc.pokemon, label: capitalise(loc.pokemon)}
      selected = o
    }

    getPkmns(encounters)
      .then(e => encounterItems = (encounters || []).map(id => e[id]).filter(i => i))
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)
    import('$lib/components/DeathModal.svelte').then(m => DeathModal = m.default)
    prevstatus = null
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
    hidden = pkmn.hidden
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
         hidden: hidden || false,
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
    search = statusSearch = natureSearch = null
    store.update(patch({ [location]: {} }))
  }

  let statusComplete = false
  const handleStatus = (sid) => () => {
    status = NuzlockeStates[sid]
    _animateStatus(sid)
  }

  const animateStatus = item => _ => _animateStatus(item.id)
  const _animateStatus = (sid) => {
    if (sid === 2 || sid === 3) statusComplete = ['parcel', 'profs-letter']
    if (sid === 1) statusComplete = ['poke-ball', 'friend-ball', 'heavy-ball', 'master-ball']
    if (sid === 5) statusComplete = ['thick-club', 'quick-claw', 'rare-bone', 'dragon-fang', 'sharp-beak']
    if (sid === 6) statusComplete = ['health-av-candy', 'tapunium-z--held', 'revive', 'electric-gem', 'max-revive']
    if (sid === 100) statusComplete = ['revival-herb', 'revival-herb', 'starf-berry']
  }

  const { open } = getContext('simple-modal')
  let evoComplete = false
  const handleSplitEvolution = (base, evolutions) => open(EvoModal, { evolutions, base, select: handleSingleEvolution })
  const handleSingleEvolution = async (id) => getPkmn(id).then(p => {
    selected = p
    evoComplete = true
  })

  const handleEvolution = (base, evos) => async () => handleSplitEvolution(base, evos)

  const handleDeath = () => open(DeathModal)

  const handleReveal = () => {
    hidden = false
    _animateStatus(100)
  }

  $: gray = NuzlockeGroups.Unavailable.includes(status?.id)
</script>

<SettingsWrapper id=nickname-clause let:setting={nicknames}>
  <div
    class:lg:grid-cols-8={nicknames}
    class:lg:grid-cols-6={!nicknames}
    class='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-3 md:gap-y-2 lg:gap-y-0 gap-x-2 flex relative w-full'>
  <span class='group location relative z-50'>
    {#if $$slots.location}
      <slot name=location />
    {:else}
      {location}
    {/if}
  </span>

  <SettingsWrapper id=encounter-suggestions let:setting={suggest}>
    <SettingsWrapper id=dupe-clause let:setting>
      {#if selected && (selected.hidden || hidden)}
        <button
          class='group overflow-hidden relative dark:bg-transparent transition-colors w-11/12 sm:w-full sm:text-xs pr-3 m-0 border-2 rounded-lg hover:border-lime-500 dark:border-gray-600 dark:hover:border-lime-400 dark:hover:bg-gray-700/25 inline-flex justify-between items-center col-span-2'
          on:click={handleReveal}
          >
          <div class='inline-flex items-center dark:opacity-100 opacity-50 blur grayscale'>
            <PIcon className='-my-2 sm:-my-3 -mx-2' name={selected.sprite} />
            <span>{selected.name}</span>
          </div>
          <span class='tracking-wide text-gray-400 dark:text-gray-200 group-hover:text-lime-500 dark:group-hover:text-lime-400'>Reveal</span>
          <Icon icon={LongGrass} height='1.4rem' class='absolute left-0.5 -bottom-1.5 text-gray-200 dark:text-gray-700 transition-colors group-hover:text-lime-400 dark:group-hover:text-lime-500 group-hover:animate-shake max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500' />
          <Icon icon={LongGrass} height='1.4rem' class='absolute left-7 -bottom-1.5 text-gray-200 dark:text-gray-700 transition-colors group-hover:text-lime-400 dark:group-hover:text-lime-500 group-hover:animate-shake max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500' />
          <Icon icon={LongGrass} height='2.5rem' class='absolute left-1.5 -bottom-3 text-gray-300 dark:text-gray-600 transition-colors group-hover:text-lime-500 dark:group-hover:text-lime-400 group-hover:animate-shake max-sm:animate-shake max-sm:text-lime-500 dark:max-sm:text-lime-400' />
        </button>
      {:else}
        <AutoComplete
          inset={selected ? true : '2.4em'}
          rounded
          fetch={search || !suggest ? getAllPkmn : null}
          items={search || !suggest ? [] : encounterItems}
          bind:search
          bind:selected
          name='{location} Encounter'
          placeholder='Find encounter'
          className='col-span-2 w-11/12 sm:w-full'
          >

          <span class='flex items-center h-8 px-4 py-5 md:py-6 '
                class:hidden={setting === 2 && evolines.has(item?.evoline)}
                class:dupe={setting === 1 && evolines.has(item?.evoline)}
                aria-label={label}
                slot=item let:item let:label>
            <PIcon name={item?.sprite} className='transform -mb-4 -ml-6 -mt-5 -mr-2' />
            {@html label}
            {#if setting === 1 && evolines.has(item?.evoline)}
              <span class='dupe__span absolute text-tiny right-4'>dupe</span>
            {/if}
          </span>

          {selected}

          <svelte:fragment slot=icon let:iconClass>
            {#if selected}
              <div class='absolute left-4 top-2 z-50'>
                {#if statusComplete}
                  <Particles amount={Math.round(Math.random() * 4) + Math. pow(statusComplete.length, 2)} icons={statusComplete} on:end={() => statusComplete = false} />
                {/if}
              </div>

              <PIcon name={selected.sprite} className='{gray ? 'grayscale' : ''} {iconClass}' />
            {:else}
              <Icon inline={true} height=0.7em icon={Search} class='fill-current left-3 text-gray-500 {iconClass}' />
            {/if}
          </svelte:fragment>
        </AutoComplete>
      {/if}
    </SettingsWrapper>
  </SettingsWrapper>

  <SettingsWrapper id=nickname-clause on=1>
    <Input
      rounded
      bind:value={nickname}
      name='{location} Nickname'
      placeholder=Nickname
      className='col-span-2 {!selected || hidden || status?.id === 4 ? 'hidden sm:block' : ''}'
      />
  </SettingsWrapper>

  <SettingsWrapper id=permadeath on=1 condition={status?.id === 5}>
    <div class='border-2 dark:border-gray-600 shadow-sm rounded-lg h-10 flex items-center text-sm dark:text-gray-200 text-gray-800 cursor-not-allowed'>
      <Icon inline={true} class='fill-current mx-2' icon={NuzlockeStates[5].icon} />
      Dead
    </div>

    <svelte:fragment slot=else>
      <AutoComplete
        wide
        rounded
        items={Object.values(NuzlockeStates)}
        bind:search={statusSearch}
        bind:selected={status}
        name='{location} Status'
        placeholder=Status
        label=state
        inset={status ? '2rem' : null}
        className='{!selected || hidden ? 'hidden sm:block' : ''} {status?.id === 4 ? 'col-span-2 sm:col-span-1' : 'col-span-1'}'
        >
        <svelte:fragment slot=icon let:iconClass let:selected>
          {#if selected}
            <Icon inline={true} class='{iconClass} fill-current left-3' icon={selected.icon} />
          {/if}
        </svelte:fragment>

        <button on:click={animateStatus(item)} class='flex inline-flex gap-x-2 px-3 py-2 md:py-3 items-center' slot=item let:item let:label>
          <Icon inline={true} icon={item.icon} class='fill-current transform md:scale-125' />
          {@html label}
        </button>
      </AutoComplete>
    </svelte:fragment>
  </SettingsWrapper>

  <AutoComplete
    wide
    rounded
    items={Natures}
    bind:search={natureSearch}
    bind:selected={nature}
    name='{location} Nature'
    placeholder=Nature
    className='col-span-1 {!selected || status?.id === 4 || hidden ? 'hidden sm:block' : ''}'
    dropdownClass='-translate-x-1/2 -ml-1 sm:translate-x-0 sm:ml-0'
  >
    <div class='flex inline-flex justify-between w-full px-5 md:px-3 py-2 md:py-3 -mx-1 items-center' slot=item let:item let:label>
      <span>{@html label}</span>
      {#if item.value.length}
        <span class='flex sm:flex-col items-end -my-4 -mr-3 gap-x-2 sm:gap-x-0 text-tiny sm:gap-y-1'>
          <span class='inline-flex justify-end items-center dark:text-blue-300 text-blue-400'>
            {item.value[0]}
            <Icon inline={true} icon={Chevron} class='fill-current' />
          </span>
          <span class='inline-flex items-center dark:text-orange-300 text-orange-600'>
            {item.value[1]}
            <Icon inline={true} icon={Chevron} class='fill-current transform rotate-180' />
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
        track=kill
        on:click={handleDeath}
        containerClassName={!selected || hidden ? 'hidden sm:block' : ''}
      />
    {/if}

    {#if selected && !hidden && !status}
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

    {#if selected && !hidden && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
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
        <Icon inline={true} height=1.4em icon={Dots} class=fill-current />

        <ul in:fly={{ duration: 250, x: 50 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-44 pt-2 flex flex-col divide-y dark:divide-gray-600' slot=popover>
          <strong class='px-4 pb-2 inline-flex justify-between w-full items-center'>
            {locationName || location}
            <Icon inline={true} icon={Map} class=fill-current />
          </strong>

          <li>
            <button on:click={onnew}>
              <Icon inline={true} icon={Add} class='fill-current mr-2'/>
              Add Location
            </button>
          </li>

          <SettingsWrapper id=permadeath on=1 condition={status?.id === 5}>
            <li slot=else>
              <button on:click={handleClear}>
                <Icon inline={true} icon={Delete} class='fill-current mr-2'/>
                Clear Encounter
              </button>
            </li>
          </SettingsWrapper>

          {#if type === 'custom'}
            <li>
              <button on:click={ondelete}>
                <Icon inline={true} icon={Bin} class='fill-current mr-2'/>
                Delete Location
              </button>
            </li>
          {/if}

          {#if selected && !hidden && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
            <li>
              <button class=inline-flex on:click={handleEvolution(selected.sprite, selected.evos)}>
                <PIcon className='transform scale-75 -mr-2 -ml-1.5 -my-1 grayscale' type='item' name='dawn-stone' />
                <span class=ml-0.5>Evolve {nickname || selected.name}</span>
              </button>
            </li>
          {/if}

          {#if selected && !hidden && !status}
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
                <Icon inline={true} icon={External} class='fill-current inline -mt-0.5 mr-2' />
                Route Info
              </a>
            </li>
          {/if}
      </ul>
  </Popover>
  </span>
  </div>
</SettingsWrapper>

<style lang="postcss">
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
