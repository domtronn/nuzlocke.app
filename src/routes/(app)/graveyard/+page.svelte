<script>
  import { browser } from '$app/environment'
  import { onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'

  import { Grave, GraveRow, Fog } from './'
  import { NuzlockeGroups } from '$lib/data/states'
  import Audio from '$lib/components/Audio.svelte'

  import { chunk } from '$lib/utils/arr'
  import { capitalise } from '$lib/utils/string'
  import deferStyles from '$lib/utils/defer-styles'

  import { activeGame, getGame, read, patch } from '$lib/store'
  import { Loader, Toggle } from '$c/core'

  import { IMG } from '$utils/rewrites'

  let ready, DeathModal

  onMount(() => {
    ready = true
    import('$lib/components/DeathModal/index.svelte').then(m => DeathModal = m.default)
  })

  // TODO: Bind all the death data to the fields in the form :vomit:

  let box = {}, gameStore
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return
    gameStore = getGame(gameId)
    gameStore.subscribe(read(data => {
      box = data
    }))
  })

  const { open } = getContext('simple-modal')
  const { getPkmn } = getContext('game')

  const handleEdit = (p) => async (o) => {
    await deferStyles('/assets/pokemon.css')
    const pokemon = await getPkmn(o.detail.pokemon)

    const mode =
          o.detail?.death?.opponent ||
          o.detail?.death?.trainer ? 'edit' : 'new'

    const submit = (death) => {
      mode === 'new'
        ? gameStore.update(patch({ [p.location]: { ...p, death } }))
        : gameStore.update(patch({ [p.location]: { ...p, death: { ...p.death, ...death }} }))
    }

    open(DeathModal, { ...o.detail, submit, pokemon, mode })
  }

  const chunkSize = 6
  let graveyard = []
  $: graveyard = Object.values(box)
        .filter(i => i.pokemon)
        .filter(i => NuzlockeGroups.Dead.includes(i.status))

  let chunked = []
  $: chunked = chunk(
    graveyard,
    chunkSize // Force 2 rows minimum
  )

  let showFog = true, showAudio = true
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Graveyard</title>
</svelte:head>


{#if ready}
<main class='w-screen overflow-hidden md:overflow-auto md:w-auto snap-always snap-y max-md:overflow-y-scroll max-md:h-screen'>
  <div class='snap-start scroll-mt-4 pt-14 md:pt-14 px-4 sm:px-8' in:fade={{ duration: 500, delay: 200}}>
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
            <div class='flex {j % 2 ? 'flex-row-reverse' : 'flex-row'} items-center justify-between max-sm:px-6 max-sm:mt-10 md:inline-block snap-start -scroll-mt-2'
                 in:fade={{ duration: 800, delay: Math.min(3000 / graveyard.length, 500) * ((i * chunkSize) + j) + 1000 }}>
              <Grave
                pokemon={p.pokemon}
                nickname={p.nickname}
                death={p?.death}
                on:click={handleEdit(p)}
              />
            </div>
          {/each}
        </GraveRow>
      {/each}
    </div>
  {/if}
  </main>
{:else}
  <Loader />
{/if}

<style>
  @media (max-width: theme('screens.md')) {
    main {
      height: calc(100vh - 38px);
      overflow-y: scroll;
    }
  }

</style>
