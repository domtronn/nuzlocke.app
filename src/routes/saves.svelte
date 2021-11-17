<script context="module">
  export const router = false
</script>

<script>
  import { browser } from '$app/env'
  import { savedGames, parse } from '$lib/store'
  import { slide, fade } from 'svelte/transition'

  import Save from '$lib/components/save.svelte'
  import { ScreenContainer, PixelatedContainer } from '$lib/components/containers'
  import { Button } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Floppy from 'svelte-icons-pack/im/ImFloppyDisk'

  const FloppyIcon = {
    ...Floppy,
    c: Floppy.c.replace(/fill="#000000"/g, '')
  }

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

<ScreenContainer>
  <span class='flex justify-between items-center md:gap-x-24'>
    <h1 class='text-lg md:text-2xl'>Load game</h1>
    <Icon src={FloppyIcon} size='1.4em' className='fill-current dark:text-gray-200g' />
  </span>

  <hr />

  <div class='flex flex-col gap-y-4' transition:slide={{ duration: 300 }}>
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
      <a sveltekit:prefetch href="/new" class='text-center'>
        <Button className='w-full'>
          Create game
        </Button>
      </a>
    {/if}
  </div>
</ScreenContainer>
