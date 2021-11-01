<script>
  import { browser } from '$app/env'
  import { savedGames } from '$lib/store'
  import { slide, fade } from 'svelte/transition'

  // TODO: No saves and back button

  import Save from '$lib/components/save.svelte'
  import ScreenContainer from '$lib/components/screen-container.svelte'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import Icon from 'svelte-icons-pack'
  import Floppy from 'svelte-icons-pack/im/ImFloppyDisk'

  let gameData = ''
  let loading = true
  savedGames.subscribe(val => {
    loading = !browser
    gameData = val
  })

  $: games = (gameData || '')
      .split(',')
      .filter(i => i)
      .map(s => s.split('|'))
      .map(([id, created, name, game]) => ({ id, created, name, game}))
</script>

<ScreenContainer>
  <span class='flex justify-between items-center gap-x-24'>
    <h1 class='text-2xl'>Load game</h1>
    <Icon src={Floppy} size='1.4em' />
  </span>

  <hr />

  <div class='flex flex-col gap-y-4' transition:slide={{ duration: 300 }}>
    {#if loading}
      <div class='flex flex-row justify-between items-center gap-x-18'>
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
      You have no games
        <a sveltekit:prefetch href="/new">
          <button>New game</button>
        </a>
      {/if}
  </div>
</ScreenContainer>
