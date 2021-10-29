<script>
  export let location

  import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
  import AutoComplete from 'simple-svelte-autocomplete'

  let selected

</script>

<div class='grid grid-cols-2 md:grid-cols-4 gap-x-2 flex items-center'>

  <span>
    {location}
  </span>

  <span class='relative'>
    {#if selected}
      <span class='pkm-wrapper absolute z-10 left-0 bottom-1 translate-y-1/4'>
        <i class='pkm pkm-{selected.sprite}' />
      </span>
    {/if}

    <AutoComplete
      hideArrow
      maxItemsToShowInList={20}
      items={Object.values(Pokemon)}
      bind:selectedItem={selected}
      placeholder={selected ? selected.name : 'Encounter'}
      labelFieldName='name'

      className='w-full min-w-0 {selected ? 'has-item' : ''}'
      inputClassName='ac__input-container text-md transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block bg-gray-50 w-full rounded-lg px-4 py-2'
      dropdownClassName='ac__dropdown-container rounded-lg bg-gray-50 border-2 border-gray-200 mt-2 shadow-md'
    >
      <div class='-m-3 flex inline-flex items-center' slot='item' let:item={item} let:label={label}>
        <span class='pkm-wrapper'><i class='pkm pkm-{item.sprite}' /></span>
        {@html label}
      </div>

      <div slot="no-results" let:noResultsText={noResultsText}>
        <strong>NO RESULTS - {noResultsText}</strong>
      </div>

    </AutoComplete>
  </span>

  <span >
    <input
      type='text'
      placeholder='Nickname'
      class='transition-colors hover:border-indigo-200 text-md focus:outline-none leading-5 focus:border-indigo-600 border-2 shadow-md block bg-gray-50 w-full rounded-lg px-3 py-2'
    />
  </span>

</div>
