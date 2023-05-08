<script>
  import { browser } from '$app/environment'
  import { onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'

  import { Grave, GraveRow, Fog } from './'
  import { NuzlockeGroups } from '$lib/data/states'
  import Audio from '$lib/components/Audio.svelte'

  import { locid } from '$utils/pokemon'
  import { chunk } from '$utils/arr'
  import { capitalise } from '$utils/string'
  import { summarise } from '$utils/badges'

  import { activeGame, getGame, read, readTeams, patch } from '$lib/store'
  import { Loader, Toggle, Tooltip, PIcon } from '$c/core'

  import { IMG } from '$utils/rewrites'

  let DeathModal
  const openDeathModal = async (args) => {
    if (DeathModal) open(DeathModal, args)
    import('$lib/components/DeathModal/index.svelte').then((m) => {
      DeathModal = m.default
      open(DeathModal, args)
    })
  }

  // TODO: Bind all the death data to the fields in the form :vomit:

  let box = {},
    bossData = {},
    gameStore
  activeGame.subscribe((gameId) => {
    if (browser && !gameId) return
    gameStore = getGame(gameId)
    gameStore.subscribe(
      read((data) => {
        box = data
        bossData = readTeams(data)
      })
    )
  })

  const region = getContext('region')
  const { open } = getContext('simple-modal')
  const { getPkmn } = getContext('game')

  const handleEdit = (p) => async (o) => {
    const pokemon = await getPkmn(o.detail.pokemon)

    const mode =
      o.detail?.death?.opponent || o.detail?.death?.trainer ? 'edit' : 'new'

    const submit = (death) => {
      mode === 'new'
        ? gameStore.update(patch({ [p.location]: { ...p, death } }))
        : gameStore.update(
            patch({ [p.location]: { ...p, death: { ...p.death, ...death } } })
          )
    }

    openDeathModal({ ...o.detail, submit, pokemon, mode })
  }

  const chunkSize = 6
  let graveyard = []
  $: graveyard = Object.values(box)
    .filter((i) => i.pokemon)
    .filter((i) => NuzlockeGroups.Dead.includes(i.status))

  let chunked = []
  $: chunked = chunk(
    graveyard,
    chunkSize // Force 2 rows minimum
  )

  let showFog = true,
    showAudio = true
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Graveyard</title>
</svelte:head>

<main
  class="w-screen snap-y snap-always overflow-hidden max-md:h-screen max-md:overflow-y-scroll md:w-auto md:overflow-auto {region}"
>
  <div
    class="snap-start scroll-mt-4 px-4 pt-14 sm:px-8 md:pt-14"
    in:fade={{ duration: 500, delay: 200 }}
  >
    {#if !graveyard.length}
      <span
        class="col-span-4 flex h-96 items-center justify-center text-center text-xl dark:text-gray-600"
      >
        You have no Pokémon in the graveyard.<br />Congratulations!
      </span>
    {:else}
      <div
        class="relative z-[999999] mx-auto mb-6 w-full md:fixed md:bottom-0 md:right-6 md:w-64"
      >
        <div class="my-2 mx-auto flex items-center justify-between gap-x-2">
          <h2 class="text-base font-medium text-gray-900 dark:text-gray-50">
            Fog animation
          </h2>
          <Toggle id="fog" bind:state={showFog} />
        </div>

        <div class="my-2 mx-auto flex items-center justify-between gap-x-2">
          <h2 class="text-base font-medium text-gray-900 dark:text-gray-50">
            Audio
          </h2>
          <Toggle id="audio" bind:state={showAudio} />
        </div>
      </div>

      {#if showAudio}<Audio
          class="bottom-8 left-0 z-[999999] lg:fixed"
          src="{IMG}/audio/lavender.mp3"
        />{/if}
      {#if showFog}<Fog />{/if}
    {/if}
  </div>

  {#if graveyard.length}
    <div class="mt-8 pb-48 sm:pb-64">
      {#each chunked as row, i}
        <GraveRow {i} maxRows={chunked.length}>
          {#each row as p, j (locid(p))}
            {@const result = summarise(p, bossData)}

            <div
              class="flex {j % 2
                ? 'flex-row-reverse'
                : 'flex-row'} snap-start -scroll-mt-2 items-center justify-between max-sm:mt-10 max-sm:px-6 md:inline-block"
              in:fade={{
                duration: 800,
                delay:
                  Math.min(3000 / graveyard.length, 500) * (i * chunkSize + j) +
                  1000
              }}
            >
              <Grave
                pokemon={p.pokemon}
                nickname={p.nickname}
                death={p?.death}
                on:click={handleEdit(p)}
              >
                <svelte:fragment slot="badges">
                  {#if result}
                    {@const { icons, summary } = result}
                    <div
                      class="-mb-6 -mt-1 flex w-20 scale-75 flex-wrap place-content-center gap-x-1 leading-4 grayscale transition group-hover:grayscale-0"
                    >
                      <Tooltip>{summary}</Tooltip>
                      {#each icons as icon}
                        <PIcon name={icon} type="b" />
                      {/each}
                    </div>
                  {/if}
                </svelte:fragment>
              </Grave>
            </div>
          {/each}
        </GraveRow>
      {/each}
    </div>
  {/if}
</main>

<style>
  @media (max-width: theme('screens.md')) {
    main {
      height: calc(100vh - 38px);
      overflow-y: scroll;
    }
  }
</style>
