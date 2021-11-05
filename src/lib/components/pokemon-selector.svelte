<script>
  export let id, location, store

  import { browser } from '$app/env'
  import { read, patch } from '$lib/store'

  import { NuzlockeStates } from '$lib/data/states'

  import Accordion from '$lib/components/accordion.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'
  import AutoComplete from 'simple-svelte-autocomplete'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'
  import Spinner from 'svelte-icons-pack/cg/CgSpinner'

  let selected
  let nickname
  let status

  const fetchItems = async () => {
    const res = await fetch('/pokemon/all.json')
    const items = await res.json()
    return items
  }

  const fetchData = async (id) => {
    if (!browser) return
    try {
      const res = await fetch(`/pokemon/${id}.json`)
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

  const handleStatus = (sid) => _ => status = NuzlockeStates[sid]

 $: gray = ['Deceased', 'Missed'].includes(status?.state)

</script>

<div class='grid grid-cols-2 md:grid-cols-8 gap-y-2 md:gap-y-0 gap-x-2 flex justify-start items-center'>

  <span class='col-span-2 md:text-right mr-4 text-sm'>
    {location}
  </span>

  <span class='relative md:col-span-2'>
    {#if selected}
      <PIcon
        className='absolute z-10 -left-2 md:left-0 bottom-1 translate-y-1/4 {gray ? 'filter grayscale' : ''}'
        name={selected.sprite}
      />
    {/if}

    <AutoComplete
      hideArrow
      delay={150}
      searchFunction={fetchItems}
      bind:selectedItem={selected}
      placeholder={selected ? selected.name : 'Encounter'}
      labelFieldName='name'

      className='text-xs md:text-md w-full min-w-0 {selected ? 'has-item' : ''}'
      inputClassName='ac__input-container transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block w-full rounded-lg'
      dropdownClassName='ac__dropdown-container rounded-lg border-2 border-gray-200 mt-2 shadow-md'
    >
      <div class='-m-3 flex inline-flex items-center' slot='item' let:item={item} let:label={label}>
        <PIcon className="-translate-x-2 transform scale-75 md:scale-100" name={item.sprite} />
        <span class="-ml-2">{@html label}</span>
      </div>

      <div slot="no-results" let:noResultsText={noResultsText}>
        <span class='inline-flex items-center h-6 text-sm text-gray-600'>
          <PIcon className='grayscale transform scale-75 -my-4 -mr-4 -ml-5' name='unown-question' />
          {noResultsText}
        </span>
      </div>

      <div slot="loading" let:loadingText={loadingText}>
        <span class='inline-flex items-center h-6 text-sm text-gray-600'>
          <Icon src={Spinner} className='fill-current animate-spin mr-2' />
          {loadingText}
        </span>
      </div>
    </AutoComplete>
  </span>

  <span class='md:col-span-2'>
    <input
      type='text'
      bind:value={nickname}
      placeholder='Nickname'
      class='text-xs md:text-md transition-colors hover:border-indigo-200 text-md focus:outline-none leading-4 focus:border-indigo-600 border-2 shadow-md block  w-full rounded-lg px-3 py-2'
    />
  </span>

  <span class='relative col-span-1'>
    {#if status}
      <Icon
        className='absolute z-10 left-3 bottom-0 mb-0.5 -translate-y-1/2'
        src={status.icon}
      />
    {/if}

    <AutoComplete
      hideArrow
      items={Object.values(NuzlockeStates)}
      bind:selectedItem={status}
      placeholder='Status'
      labelFieldName='state'

      className='text-xs md:text-md w-full min-w-0 {status ? 'has-status' : ''}'
      inputClassName='ac__input-container text-md transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block  w-full rounded-lg px-4 py-2'
      dropdownClassName='ac__dropdown-container rounded-lg  border-2 border-gray-200 mt-2 shadow-md'
      >
      <div class='flex inline-flex gap-x-2 py-2 items-center' slot='item' let:item={item} let:label={label}>
        <Icon src={item.icon} className='fill-current' />
        {@html label}
      </div>

      <div slot="no-results" let:noResultsText={noResultsText}>
        <span class='inline-flex items-center h-6 text-sm text-gray-600'>
          <PIcon className='grayscale transform scale-75 -my-4 -mr-4 -ml-5' name='unown-question' />
          {noResultsText}
        </span>
      </div>
    </AutoComplete>
  </span>

  <span class='text-left inline-flex gap-x-2'>
    <button
      aria-label='Clear pokemon'
      class='bg-white hover:active:bg-indigo-50 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-indigo-600 hover:active:border-indigo-600 hover:text-indigo-300 hover:border-indigo-200 rounded-lg p-2 transition-all border-2'
      on:click={handleClear}
    >
      <Icon src={Bin} className='fill-current' />
    </button>

    {#if status && status.id !== 4 && status.id !== 5}
      <button
        aria-label='Kill pokemon'
        class='bg-white hover:active:bg-indigo-50 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-indigo-600 hover:active:border-indigo-600 hover:text-indigo-300 hover:border-indigo-200 rounded-lg p-2 transition-all border-2'
        on:click={handleStatus(5)}
      >
        <Icon src={Deceased} className='fill-current' />
      </button>
    {/if}

    {#if selected && !status}
      <button
        aria-label='Capture pokemon'
        class='group flex items-center bg-white hover:grayscale-0 hover:opacity-100 grayscale hover:active:bg-orange-100 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-orange-600 hover:active:border-orange-600 hover:border-orange-300 rounded-lg transition-all border-2'
        on:click={handleStatus(1)}
      >
        <PIcon name='poke-ball' type='item' className='transition-opacity -translate-y-0.5 opacity-50 group-hover:opacity-100' />
      </button>
    {/if}

  </span>

</div>
