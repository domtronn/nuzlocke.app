<script>
 export let id, location

 import { game, read, patch } from '$lib/store'

 import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
 import Accordion from '$lib/components/accordion.svelte'
 import PIcon from '$lib/components/pokemon-icon.svelte'
 import StatBlock from '$lib/components/stat-block.svelte'
 import AutoComplete from 'simple-svelte-autocomplete'

 import Icon from 'svelte-icons-pack'
 import Ball from 'svelte-icons-pack/bi/BiTennisBall'
 import Gift from 'svelte-icons-pack/bi/BiSolidGift'
 import Traded from 'svelte-icons-pack/cg/CgArrowsExchange'
 import Missed from 'svelte-icons-pack/ri/RiWeatherWindyLine'
 import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'
 import Bin from 'svelte-icons-pack/bi/BiTrash'

 const NuzlockeStates = {
   1: { id: 1, state: 'Captured', icon: Ball },
   2: { id: 2, state: 'Received', icon: Gift },
   3: { id: 3, state: 'Traded', icon: Traded },
   4: { id: 4, state: 'Missed', icon: Missed },
   5: { id: 5, state: 'Deceased', icon: Deceased },
 }

 let selected
 let nickname
 let status

 game.subscribe(read(data => {
   const pkmn = data[location]
   if (!pkmn) return

   status = pkmn.status ? NuzlockeStates[pkmn.status] : null
   selected = Pokemon[pkmn.pokemon]
   nickname = pkmn.nickname
 }))

 $: {
   if (selected)
     game.update(patch({
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
   selected = null
   nickname = null
   status = null
   game.update(patch({ [location]: {} }))
 }

 function handleDeath () {
   status = NuzlockeStates[5]
 }

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
      maxItemsToShowInList={20}
      items={Object.values(Pokemon)}
      bind:selectedItem={selected}
      placeholder={selected ? selected.name : 'Encounter'}
      labelFieldName='name'

      className='text-xs md:text-md w-full min-w-0 {selected ? 'has-item' : ''}'
      inputClassName='ac__input-container transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block w-full rounded-lg'
      dropdownClassName='ac__dropdown-container rounded-lg border-2 border-gray-200 mt-2 shadow-md'
    >
      <div class='-m-3 flex inline-flex items-center' slot='item' let:item={item} let:label={label}>
        <PIcon className="-translate-x-2 transform scale-75 md:scale-100" name={item.sprite} />
        <span class="-ml-2">{label}</span>
      </div>

      <div slot="no-results" let:noResultsText={noResultsText}>
        <strong>NO RESULTS - {noResultsText}</strong>
      </div>

    </AutoComplete>
  </span>

  <span class='sm:col-span-2'>
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
        <strong>NO RESULTS - {noResultsText}</strong>
      </div>
    </AutoComplete>
  </span>

  <span class='text-left'>
    <button
      class='bg-white hover:active:bg-indigo-50 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-indigo-600 hover:active:border-indigo-600 hover:text-indigo-300 hover:border-indigo-200 rounded-lg p-2 transition-all border-2'
      on:click={handleClear}
    >
      <Icon src={Bin} className='fill-current' />
    </button>

    {#if status && status.id !== 4 && status.id !== 5}
      <button
        class='bg-white hover:active:bg-indigo-50 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-indigo-600 hover:active:border-indigo-600 hover:text-indigo-300 hover:border-indigo-200 rounded-lg p-2 transition-all border-2'
        on:click={handleDeath}
      >
        <Icon src={Deceased} className='fill-current' />
      </button>
    {/if}
  </span>

</div>
