<script>
  import { savedGames, activeGame, createGame } from '$lib/store'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import ScreenContainer from '$lib/components/screen-container.svelte'

  import AutoComplete from 'simple-svelte-autocomplete'
  import File from 'svelte-icons-pack/cg/CgFileAdd'
  import Games from '$lib/data/games.json'
  import PIcon from '$lib/components/pokemon-icon.svelte'

  let gameName = ''
  const handleNewGame = () => {
    if (!selectedGame.supported)
      return alert(`Sorry, ${selectedGame.title} is currently not supported`)

    savedGames.update(createGame(gameName, selected))
    window.location = '/game'
  }

  let hoverActive = false
  const togglehover = _ => hoverActive = !hoverActive

  let selected
  const handleSelect = id => _ => selected === id ? selected = null : selected = id

  let gen = 'All'

  $: selectedGame = Games[selected]
  $: disabled = !gameName.length || !selected
</script>

<ScreenContainer title='New Nuzlocke' icon={File}>
  <div class='flex flex-col md:flex-row md:flex-wrap gap-y-4 gap-2'>
    <input
      type='text'
      bind:value={gameName}
      placeholder='Name'
      class='text-xs md:text-base flex-1 dark:border-gray-600 dark:bg-gray-700 transition-colors dark:hover:border-indigo-400 hover:border-indigo-200 text-md focus:outline-none leading-4 focus:border-indigo-600 border-2 shadow-md block w-full rounded-lg px-3 py-2'
    />

    <span class='relative block md:hidden'>
      {#if selectedGame}
        <img class='absolute z-40 left-2 top-1/2 -translate-y-1/2' width=36 src={selectedGame.logo} alt={selectedGame.title + ' logo'} />
      {/if}
      <AutoComplete
        hideArrow
        items={Object.keys(Games)}
        placeholder='Game'
        bind:selectedItem={selected}
        labelFunction={function (id) { return id && Games[id].title }}

        className='text-xs sm:text-base w-full min-w-0 {selected ? 'has-status-lg' : ''}'
        inputClassName='ac__input-container dark:bg-gray-700 dark:border-gray-600 transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block w-full rounded-lg'
        dropdownClassName='ac__dropdown-container rounded-lg  border-2 border-gray-200 mt-2 shadow-md'
        >
        <div class='flex inline-flex gap-x-2 py-2 items-center h-8' slot='item' let:item={item} let:label={label}>
          {#if Games[item].logo}
            <img width=32 src={Games[item].logo} alt={Games[item].title + ' logo'} />
          {/if}
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

    <button
      disabled={disabled}
      on:click={handleNewGame}
      class:focus:active:border-indigo-600={!disabled}
      class:focus:active:bg-indigo-600={!disabled}
      class:focus:active:text-white={!disabled}
      class:hover:text-indigo-300={!disabled}
      class:hover:border-indigo-200={!disabled}

      class:dark:border-indigo-600={!disabled}
      class:dark:bg-indigo-600={!disabled}
      class:dark:text-gray-200={!disabled}
      class:dark:hover:bg-indigo-400={!disabled}
      class:dark:hover:text-indigo-600={!disabled}

      class='bg-white flex-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 disabled:opacity-25 w-full md:w-auto disabled:bg-gray-50 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 transition-colors text-gray-500 text-base focus:outline-none leading-4  border-2 shadow-md block rounded-lg px-3 py-2'>
      Create game
    </button>
  </div>

  <div class='flex-row gap-x-3 hidden md:flex'>
    {#each ['All'].concat(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']) as val, i}
      <label
        class='cursor-pointer transition-colors border-b-2 rounded-none text-base'
        class:border-transparent={gen !== val}
        class:border-black={gen === val}
        class:text-black={gen === val}
        class:dark:text-gray-50={gen === val}
        class:text-gray-400={gen !== val}
        class:hover:border-gray-300={gen !== val}
      >
        <input type=radio bind:group={gen} name='gen' value={val} />
        {#if i !== 0}
          Gen
        {/if}
        {val}
      </label>
    {/each}
  </div>

  <div class='grid items-center justify-center gap-x-4 gap-y-6 grid-cols-3 md:grid-cols-4 hidden md:grid'>
    {#each Object.entries(Games) as [id, game]}
      {#if game.logo && (gen === 'All' || game.gen === gen) }
        <span class='w-full text-center'>
          <img
            class='w-24 mx-auto transition hover:grayscale-0 cursor-pointer'
            class:grayscale={(selected && selected !== id) || hoverActive}
            class:grayscale-0={selected === id}
            on:click={handleSelect(id)}
            on:mouseenter={togglehover}
            on:mouseleave={togglehover}
            src={game.logo}
            alt={'Pokémon ' + game.title + ' logo'}
          />
        </span>
      {/if}
    {/each}
  </div>
</ScreenContainer>

<style>
  label > input { display: none; }
  img { transition-duration: 250ms !important; }
</style>
