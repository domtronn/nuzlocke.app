<script>
  import { savedGames, activeGame, createGame } from '$lib/store'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import ScreenContainer from '$lib/components/screen-container.svelte'

  import File from 'svelte-icons-pack/cg/CgFileAdd'
  import Games from '$lib/data/games.json'

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
  {#if selected}
    <p>
      {selectedGame.title}
    </p>
  {/if}
  <div class='inline-flex gap-x-2'>
    <input
      type='text'
      bind:value={gameName}
      placeholder='Name'
      class='transition-colors hover:border-indigo-200 text-md focus:outline-none leading-4 focus:border-indigo-600 border-2 shadow-md block rounded-lg px-3 py-2'
      />

    <button
      disabled={disabled}
      on:click={handleNewGame}
      class:focus:active:border-indigo-600={!disabled}
      class:focus:active:bg-indigo-600={!disabled}
      class:focus:active:text-white={!disabled}
      class:hover:text-indigo-300={!disabled}
      class:hover:border-indigo-200={!disabled}
      class='disabled:opacity-25 disabled:bg-gray-50 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 transition-colors text-gray-500   text-md focus:outline-none leading-4  border-2 shadow-md block rounded-lg px-3 py-2'>
      New game
    </button>

  </div>

  <div class='flex flex-row gap-x-2'>
    {#each ['All'].concat(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']) as val, i}
      <label
        class='cursor-pointer transition-colors border-b-2 rounded-none text-md'
        class:border-transparent={gen !== val}
        class:border-black={gen === val}
        class:text-black={gen === val}
        class:text-gray-400={gen !== val}
        class:hover:border-gray-300={gen !== val}
      >
        <input type=radio bind:group={gen} name='gen' value={val} />
        {#if i !== 0}
          <span class='hidden md:inline-block'>
            Gen
          </span>
        {/if}
        {val}
      </label>
    {/each}

  </div>

  <div class='grid items-center justify-center gap-x-4 gap-y-6 grid-cols-3 md:grid-cols-4'>

    {#each Object.entries(Games) as [id, game]}
      {#if game.logo && (gen === 'All' || game.gen === gen) }
        <span class='w-full text-center'>
          <img
            class='w-auto md:w-32 mx-auto transition hover:grayscale-0 cursor-pointer'
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
  img {
    transition-duration: 250ms !important;
  }
</style>
