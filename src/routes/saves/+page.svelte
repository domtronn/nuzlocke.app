<script context="module">
  export const router = false
</script>

<script>
  import { browser } from '$app/environment'
  import { savedGames, parse } from '$lib/store'
  import { slide } from 'svelte/transition'

  import Save from '$lib/components/save.svelte'
  import Import from '$lib/components/qr/Import.svelte'

  import { ScreenContainer } from '$lib/components/containers'
  import { Button } from '$lib/components/core'

  import Modal from 'svelte-simple-modal'
  import { Floppy } from '$icons'

  let games = []
  let loading = true
  savedGames.subscribe(parse(g => {
    loading = !browser
    games = Object.values(g)
  }))
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Load game</title>
</svelte:head>

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  styleWindow={{ background: 'transparent !important' }}
  styleContent={{ padding: '0 !important', overflow: 'hidden' }}
>
  <ScreenContainer containerClassName='pb-48 mb-0 sm:mb-0 md:mb-0' title='Load game' icon={Floppy}>
    <div class='flex flex-row gap-x-2 text-xs w-full'>
      <Import className='flex-1 p-1'>
        Import saved game
      </Import>

      <a data-sveltekit-preload-data href="/new" class='text-center flex flex-1'>
        <Button rounded className='w-full p-1'>
          Create game
        </Button>
      </a>
    </div>

    <div class='flex flex-col gap-y-8 md:gap-y-4' transition:slide={{ duration: 300 }}>
      {#if loading}
        <div class='flex flex-row justify-between items-center gap-x-24 mt-2'>
          <div class='flex flex-row items-center'>
            <div class='bg-gray-400 animate-pulse h-16 w-16 -mt-1.5 mr-4 rounded-md' />

            <div>
              <p class=' transition w-16 h-5 animate-pulse bg-gray-400 rounded-md' />
              <p class=' transition w-32 mt-1 h-3 animate-pulse bg-gray-400 rounded-md' />
              <div class='h-4 mt-2 inline-flex gap-x-1'>
                <div class='w-4 h-4 animate-pulse bg-gray-400 rounded-full' />
                <div class='w-4 h-4 animate-pulse bg-gray-400 rounded-full' />
                <div class='w-4 h-4 animate-pulse bg-gray-400 rounded-full' />
                <div class='w-4 h-4 animate-pulse bg-gray-400 rounded-full' />
              </div>
            </div>
          </div>

          <div class='w-20 h-6 inline-flex animate-pulse bg-gray-400 rounded-md' />
        </div>
      {:else if games.length}
        {#each games as game (game.id)}
          <Save {...game} />
        {/each}
      {:else if !loading && !games.length}
        <span class='text-center'>You currently have no saved games</span>
        <a data-sveltekit-preload-data href="/new" class='text-center'>
          <Button rounded className='w-full'>
            Create game
          </Button>
        </a>
      {/if}
    </div>
  </ScreenContainer>
</Modal>
