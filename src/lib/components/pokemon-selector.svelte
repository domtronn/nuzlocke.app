<script>
  export let id, location, store

  import { browser } from '$app/env'
  import { read, patch } from '$lib/store'

  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'

  import Accordion from '$lib/components/accordion.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'
  import Spinner from 'svelte-icons-pack/cg/CgSpinner'

  import { onMount, getContext } from 'svelte'

  let selected, nickname, status

  let Particles, EvoModal
  onMount(() => {
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)
  })

  const fetchItems = async () => {
    const res = await fetch('/api/pokemon/all.json')
    const items =  res.json()
    console.log(items)
    return items
  }

  const fetchData = async (id) => {
    if (!browser) return
    try {
      const res = await fetch(`/api/pokemon/${id}.json`)
      const data = await res.json()
      return data
    } catch (e) {
      console.error(e)
    }
  }

  let loading = true
  store.subscribe(read(data => {
    const pkmn = data[location]
    if (!pkmn) return

    status = pkmn.status ? NuzlockeStates[pkmn.status] : null
    nickname = pkmn.nickname
    if (pkmn.pokemon)
      fetchData(pkmn.pokemon)
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
  const handleStatus = (sid) => _ => {
    if (sid === 1) captureComplete = true
    status = NuzlockeStates[sid]
  }

  const { open } = getContext('simple-modal')
  let evoComplete = false
  const handleSplitEvolution = (base, evolutions) => open(EvoModal, { evolutions, base, select: handleSingleEvolution })
  const handleSingleEvolution = async (id) => fetchData(id).then(p => {
    selected = p
    evoComplete = true
  })

  const handleEvolution = (base, evos) => async _ => handleSplitEvolution(base, evos)

 $: gray = ['Dead', 'Missed'].includes(status?.state)
</script>

<div data-selected={!!selected} class='grid grid-cols-2 md:grid-cols-8 gap-y-3 md:gap-y-0 gap-x-2 flex'>
  <span class='col-span-2 md:text-right mr-4 sm:text-sm text-lg mt-4 sm:mt-0 h-full font-medium sm:font-normal flex md:justify-end items-center'>
    {location}
  </span>

  <AutoComplete
    rounded
    fetch={fetchItems}
    inset={!!selected}
    bind:selected={selected}
    placeholder=Encounter
    label=name

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
            <Particles icons={['ice-stone', 'dawn-stone', 'fire-stone']} on:end={_ => evoComplete = false} />
          {/if}
          {#if captureComplete}
            <Particles icons={['poke-ball', 'friend-ball', 'heavy-ball', 'master-ball']} on:end={_ => captureComplete = false} />
          {/if}
        </div>

        <PIcon name={selected.sprite} className='{gray ? 'filter grayscale' : ''} {iconClass}' />
      {/if}
    </svelte:fragment>
  </AutoComplete>

  <Input
    rounded
    bind:value={nickname}
    placeholder=Nickname
    className=col-span-2
  />

  <AutoComplete
    rounded
    items={Object.values(NuzlockeStates)}
    bind:selected={status}
    placeholder=Status
    label=state
    inset={status ? '2rem' : null}
    className=col-span-1
  >

    <svelte:fragment slot=icon let:iconClass let:selected>
      {#if selected}
        <Icon className='{iconClass} left-3' src={selected.icon} />
      {/if}
    </svelte:fragment>

    <div class='flex inline-flex gap-x-2 py-2 items-center' slot=item let:item let:label>
      <Icon src={item.icon} className='fill-current' />
      {@html label}
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
