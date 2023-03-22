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
        // .filter(i => NuzlockeGroups.Dead.includes(i.status))

  const chunkSize = 6
  const chunked = chunk(
    graveyard.concat(graveyard).concat(graveyard),
    chunkSize // Force 2 rows minimum
  )
</script>

{#if ready}
  <div in:fade={{ duration: 500, delay: 200}}>
    {#if name}
      <h1 class='mt-16 md:mt-4 mb-4 text-center'>{capitalise(name)} Graveyard</h1>
    {/if}

    {#if graveyard.length}
      <Audio src=/audio/lavender.mp3 />
    {/if}

    <!-- TODO: Add some copy to summarise the deaths -->

  </div>

  <Fog />

  <div class='pb-48 sm:pb-64 mt-8'>
    {#each chunked as row, i}
      <GraveRow {i} maxRows={chunked.length}>
        {#each row as p, j}
          <div class='md:inline-block'
               in:fade={{ duration: 800, delay: (300 * ((i * chunkSize) + j)) + 1000 }}
               >
            <Grave {...p} i={(i * chunkSize) + j} className='row--{i}' />
          </div>
        {/each}
      </GraveRow>
    {/each}
  </div>
{/if}

<style>
  h1 { @apply text-2xl text-gray-800 }
  :global(.dark) h1 { @apply text-gray-200 }

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
