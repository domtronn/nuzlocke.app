<script>
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import { Grave, GraveRow, Fog } from './'
  import { NuzlockeGroups } from '$lib/data/states'
  import Audio from '$lib/components/Audio.svelte'

  import { chunk } from '$lib/utils/arr'
  import { capitalise } from '$lib/utils/string'

  import { activeGame, getGame, read, savedGames, parse } from '$lib/store'
  import { Loader, Toggle } from '$c/core'

  import { IMG } from '$utils/rewrites'

  let ready
  onMount(() => ready = true)

  let box = {}, name = ''
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    getGame(gameId).subscribe(read(data => box = data))
    savedGames.subscribe(parse(games => {
      name = games[gameId]?.name
    }))
  })

  const graveyard = Object.values(box)
        .filter(i => i.pokemon)
        .filter(i => NuzlockeGroups.Dead.includes(i.status))

  const chunkSize = 6
  const chunked = chunk(
    graveyard,
    chunkSize // Force 2 rows minimum
  )

  let showFog = true, showAudio = true
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Graveyard</title>
</svelte:head>


{#if ready}
  <section class='w-screen overflow-hidden md:overflow-auto md:w-auto'>
  <div class='md:pt-8 px-4 sm:px-8' in:fade={{ duration: 500, delay: 200}}>
    {#if !graveyard.length}
      <span class='h-96 flex items-center justify-center text-center col-span-4 dark:text-gray-600 text-xl'>
        You have no Pokémon in the graveyard.<br />Congratulations!
      </span>
    {:else}
      <div class='w-full md:w-64 mb-6 mx-auto relative md:fixed md:bottom-0 md:right-6'>
      <div class='flex items-center gap-x-2 my-2 mx-auto justify-between'>
        <h2 class='text-base dark:text-gray-50 text-gray-900 font-medium'>Fog animation </h2>
        <Toggle id=fog bind:state={showFog} />
      </div>

      <div class='flex items-center gap-x-2 my-2 mx-auto justify-between'>
        <h2 class='text-base dark:text-gray-50 text-gray-900 font-medium'>Audio</h2>
        <Toggle id=audio bind:state={showAudio} />
      </div>
      </div>

      {#if showAudio}<Audio class="lg:fixed bottom-8 left-0" src="{IMG}/audio/lavender.mp3" />{/if}
      {#if showFog}<Fog />{/if}
    {/if}
  </div>

  {#if graveyard.length}
    <div class='pb-48 sm:pb-64 mt-8'>
      {#each chunked as row, i}
        <GraveRow {i} maxRows={chunked.length}>
          {#each row as p, j}
            <div class='flex {j % 2 ? 'flex-row-reverse' : 'flex-row'} items-center justify-between max-sm:px-6 max-sm:mt-10 md:inline-block'
                 in:fade={{ duration: 800, delay: Math.min(3000 / graveyard.length, 500) * ((i * chunkSize) + j) + 1000 }}
                 >
              <Grave {...p} i={(i * chunkSize) + j} className='row--{i}' />
            </div>
          {/each}
        </GraveRow>
      {/each}
    </div>
  {/if}
  </section>
{:else}
  <Loader />
{/if}

<style>
  :global(.row--0 div:nth-child(3n) .tombstone),
  :global(.row--1 div:nth-child(5n - 1) .tombstone),
  :global(.row--2 div:nth-child(4n + 2) .tombstone),
  :global(.row--3 div:nth-child(2n + 3) .tombstone),
  :global(.row--4 div:nth-child(2n - 1) .tombstone),
  :global(.row--5 div:nth-child(5n - 4) .tombstone)
  {
    @apply !-ml-1;
    transform: translate(var(--tw-translate-x),var(--tw-translate-y))
               rotate(2deg)
               skewX(var(--tw-skew-x))
               skewY(var(--tw-skew-y))
               scaleX(-1)
               scaleY(var(--tw-scale-y)) !important;
  }

</style>
