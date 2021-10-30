<script>
  import { createGame } from '$lib/store'

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

  let gameName

  const handleNewGame = () => {
    createGame(gameName, 'sw')
  }

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
        on:click={handleNewGame}
        class='transition-colors text-gray-500 focus:active:bg-indigo-600 focus:active:text-white hover:text-indigo-300 hover:border-indigo-200 text-md focus:outline-none leading-4 focus:active:border-indigo-600 border-2 shadow-md block rounded-lg px-3 py-2'>
        New game
      </button>

    </div>

    <div class='grid grid-cols-2 gap-x-2 mt-4'>
      {#each data as game}
        <div class='border-4 border-gray-300 bg-gray-50 rounded-xl px-4 py-2 text-center'>
          <span class='h-full inline-flex items-center justify-center'>
            {#each game.logos as logoId}
              <img src='/{logoId}-logo.png' alt={logoId} class='w-32' />
            {/each}
          </span>
        </div>
      {/each}
    </div>
  </main>
</div>
