<script context="module">
  export const prerender = true
</script>

<script>
  import { savedGames, activeGame, createGame } from '$lib/store'
  import { PixelatedContainer, ScreenContainer } from '$lib/components/containers'

  import { AutoComplete, Input } from '$lib/components/core'

  import File from 'svelte-icons-pack/cg/CgFileAdd'
  import Games from '$lib/data/games.json'
  import Button from '$lib/components/core/Button.svelte'
  import Tabs from '$lib/components/core/Tabs.svelte'
  import PIcon from '$lib/components/pokemon-icon.svelte'

  import { filterObj } from '$lib/utils/arr'

  let validGames = filterObj(Games, g => g.supported)

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
  const gens = ['All']
    .concat(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'])
    .map((l, i) => ({ label: i === 0 ? l : `Gen ${l}`, val: l }))

  $: selectedGame = validGames[selected]
  $: disabled = !gameName.length || !selected
</script>

<ScreenContainer title='New Nuzlocke' className='-mt-16' icon={File}>
  <div class='flex flex-col md:flex-row md:flex-wrap sm:gap-y-4 gap-2'>
    <Input
      rounded
      placeholder=Name
      className=sm:flex-1
      bind:value={gameName}
    />

    <AutoComplete
      rounded
      placeholder=Game
      className='block sm:hidden'
      items={Object.keys(validGames)}
      label={i => i && Games[i].title}
      bind:selected={selected}
    >

      <div class='flex inline-flex gap-x-2 py-2 items-center h-8' slot='item' let:item={i} let:label={label}>
        {#if Games[i].logo}
          <img width=32 src={Games[i].logo} alt={Games[i].title + ' logo'} />
        {/if}
        {@html label}
      </div>

    </AutoComplete>

    <span class='relative block md:hidden'>
      {#if selectedGame}
        <img class='absolute z-40 left-2 top-1/2 -translate-y-1/2' width=36 src={selectedGame.logo} alt={selectedGame.title + ' logo'} />
      {/if}

      <AutoComplete
        hideArrow
        items={Object.keys(validGames)}
        placeholder='Game'
        bind:selectedItem={selected}
        labelFunction={function (id) { return id && Games[id].title }}

        className='text-xxs sm:text-base w-full min-w-0 {selected ? 'has-status-lg' : ''}'
        inputClassName='ac__input-container dark:bg-gray-700 dark:border-gray-600 transition-colors hover:border-indigo-200 focus:outline-none focus:border-indigo-600 border-2 shadow-md block w-full rounded-lg'
        dropdownClassName='ac__dropdown-container rounded-lg  border-2 border-gray-200 mt-2 shadow-md'
        >
        <div class='flex inline-flex gap-x-2 py-2 items-center h-8' slot='item' let:item={item} let:label={label}>
          {#if Games[item].logo}
            <img width=32 src={Games[item].logo} alt={Games[item].title + ' logo'} />
          {/if}
          {@html label}
        </div>

        <span slot="no-results" let:noResultsText={noResultsText} class='inline-flex items-center h-6 text-sm text-gray-600 dark:text-gray-50'>
          <PIcon className='grayscale transform scale-75 -my-4 -mr-4 -ml-5' name='unown-question' />
          {noResultsText}
        </span>

      </AutoComplete>
    </span>

    <Button rounded disabled={disabled} on:click={handleNewGame}>
      Create game
    </Button>
  </div>

  <Tabs name='gens' className='hidden md:flex' tabs={gens} bind:selected={gen} />

  <div class='grid items-center justify-center gap-x-4 gap-y-6 grid-cols-3 md:grid-cols-4 hidden md:grid'>
    {#each Object.entries(validGames) as [id, game]}
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

  <i class='p-2 text-sm text-center text-gray-400'>
    <b>N.B.</b> Missing games just haven't had the data created for them yet,
    <br />they will be updated regularly so check back soon for your favourite!
  </i>

</ScreenContainer>

<style>
  img { transition-duration: 250ms !important; }
</style>
