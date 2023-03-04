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

  const chunkSize = Math.min(6, Math.floor(graveyard.length / 2))
  const chunked = chunk(
    graveyard,
    chunkSize // Force 2 rows minimum
  )
</script>

{#if ready}
  <div in:fade={{ duration: 1000, delay: 200}}>
    {#if name}
      <h1 class='mt-16 md:mt-4 mb-4 text-center'>{capitalise(name)} Graveyard</h1>
    {/if}

    {#if graveyard.length}
      <Audio src=/audio/lavender.mp3 />
    {/if}
  </div>

  <Fog />

  <div class='pb-48 sm:pb-64 mt-8'>
    {#each chunked as r, i}
      <GraveRow {i} maxRows={chunked.length}>
        {#each r as p, j}
          <div class='md:inline-block'
               in:fade={{ duration: 800, delay: (300 * ((i * chunkSize) + j)) + 1000 }}
               >
            <Grave {...p} className='row--{i}' />
          </div>
        {/each}
      </GraveRow>
    {/each}
  </div>
{/if}

<style>
  h1 { @apply text-2xl text-gray-800 }
  :global(.dark) h1 { @apply text-gray-200 }
</style>
