<script>
  import { savedGames, createGame } from '$lib/store'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'

  const data = [
    {
      title: 'Sword & Shield',
      logos: ['sw', 'sh'],
      gen: 'VIII'
    },
    {
      title: 'Heart Gold & Soul Silver',
      logos: ['hg', 'ss'],
      gen: 'II'
    }
  ]

  savedGames.subscribe(val => console.log(val))

  let gameName = ''
  const handleNewGame = () => savedGames.update(createGame(gameName, selected))

  let hoverActive = false
  const togglehover = _ => hoverActive = !hoverActive

  let selected
  const handleSelect = id => _ => selected === id ? selected = null : selected = id

  $: disabled = !gameName.length || !selected
</script>

<div class='container px-96 mx-auto'>
  <main class='px-4 md:px-8 py-6 flex flex-col items-center gap-y-4'>
    <h1 class='text-4xl'>New Nuzlocke</h1>
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

    <div class='grid grid-cols-2 gap-x-10 mt-4'>
      {#each data as game}
        <PixelatedContainer
          width='.2rem'
          className='px-4 py-2 text-center inline-flex'
        >
            <span class='h-full inline-flex items-center justify-center'>
              {#each game.logos as logoId}
                <img
                  class='w-32 hover:grayscale-0 cursor-pointer'
                  class:grayscale={(selected && selected !== logoId) || hoverActive}
                  class:grayscale-0={selected === logoId}
                  on:click={handleSelect(logoId)}
                  on:mouseenter={togglehover}
                  on:mouseleave={togglehover}
                  src='/{logoId}-logo.png'
                  alt={logoId}
                  />
              {/each}
            </span>
          </PixelatedContainer>
      {/each}
    </div>
  </main>
</div>

<style>
  img {
    transition-duration: 250ms !important;
  }
</style>
