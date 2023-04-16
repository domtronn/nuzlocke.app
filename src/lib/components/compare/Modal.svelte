<script>
  export let pokemon = [],
    id = ''

  import { browser } from '$app/environment'

  import { getContext } from 'svelte'

  import { activeGame, getGame, read, readBox, readTeam } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'

  import { Plus, Minus } from '$icons'

  import {
    CompareStats,
    CompareCard,
    CompareControls,
    CompareInfo,
    CompareMoves
  } from './'
  import { Accordion, Tabs, Icon } from '$lib/components/core'

  const { getPkmn, getPkmns } = getContext('game')

  $: team = []
  $: box = []
  $: gym = []
  $: loading = true

  const fetchadvice = (team, box) =>
    fetch('/api/battle/advice.json', {
      method: 'POST',
      body: JSON.stringify({ team, box }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())

  let team,
    boxData = {}

  // TODO: Add ability to update team from compare modal

  activeGame.subscribe((gameId) => {
    if (browser && !gameId) return

    getGame(gameId).subscribe(
      read((data) => {
        let ogTeam = readTeam(data).map((id) => data[id])
        getPkmns(ogTeam.map((p) => p.pokemon)).then((d) => {
          team = ogTeam.map((it) => ({ ...it, ...d[it.pokemon] }))
        })

        // Fetch all gym pokemon from cache
        getPkmns(pokemon.map((p) => p.name)).then((d) => {
          gym = pokemon.map((it) => ({ original: it, ...d[it.name] }))
          j = Math.max(
            gym.findIndex((i) => i.alias === id),
            0
          )
        })

        // Fetch all box pokemon from cache
        const teamLocs = readTeam(data)
        Promise.all(
          readBox(data)
            .filter((i) => !teamLocs.includes(i.customId || i.location))
            .map((p) => getPkmn(p.pokemon).then((d) => ({ ...p, ...d })))
        ).then((d) => {
          box = d.sort((a, b) => b.total - a.total)

          loading = false
        })
      })
    )
  })

  let i = -1,
    j = 0,
    k = 0,
    active = 'team'
  $: compare =
    active === 'team'
      ? [
          { ...team[k], id: k },
          { ...gym[j], id: j }
        ]
      : [
          { ...box[i], id: i },
          { ...gym[j], id: j }
        ]

  let tab = 0
  $: tab = 0
  const select = (p) => p?.sprite
</script>

<section class="pb-4">
  {#if !loading && !box.length}
    <div
      class="rounded-xl bg-white px-6 py-8 text-center text-xl shadow-lg dark:bg-gray-900 dark:text-gray-50"
    >
      <p class="mb-4">You currently have no Pokémon to compare.</p>
      <p>Go back out there and Catch 'em All!</p>
    </div>
  {:else if box.length && gym.length && Array.isArray(team)}
    {#await fetchadvice(pokemon, box.concat(team)) then advice}
      <CompareCard className="mt-12" pokemon={compare}>
        <!-- Mobile display compare stats & info in tabs -->
        {#key compare}
          <div
            class:hidden={tab !== 0}
            class="relative flex flex-row gap-x-2 bg-white p-4 dark:bg-gray-900 dark:text-gray-50 md:flex"
          >
            <CompareStats pokemon={compare} side="left" />
            <CompareStats pokemon={[...compare].reverse()} side="right" />
          </div>

          <div
            class="flex flex-wrap border-gray-300 bg-white py-4 pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 md:border-t md:py-3 md:pl-8 md:pr-4"
            class:hidden={tab !== 1}
          >
            <CompareInfo {...advice} pokemon={compare} />
          </div>

          <div
            class="flex w-full flex-wrap rounded-b-lg border-gray-300 bg-white py-4 pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 md:border-t md:py-3 md:pl-8 md:pr-4"
            class:hidden={tab !== 2}
          >
            <CompareMoves calc={advice.calc} pokemon={compare} />
          </div>
        {/key}

        <Tabs
          bind:selected={tab}
          className="md:hidden w-full justify-end pr-5 dark:bg-gray-900 bg-white -my-1"
          name="page"
          tabs={['Stats', 'Info', 'Moves']}
        />

        <!-- Accordion info Desktop display -->
        <div
          class="rounded-b-lg border-gray-200 bg-white pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 md:border-t md:py-3 md:pl-8 md:pr-4"
        >
          <Accordion
            className="hidden md:flex flex-row-reverse justify-between"
          >
            <strong slot="heading" class="text-sm"> Info </strong>
            <span slot="icon" let:isOpen let:classes={className}>
              {#if isOpen}
                <Icon
                  inline={true}
                  height="0.8em"
                  icon={Minus}
                  class="{className} -rotate-90 transform"
                />
              {:else}
                <Icon
                  inline={true}
                  height="0.8em"
                  icon={Plus}
                  class={className}
                />
              {/if}
            </span>

            <div slot="item" class="text-gray-800 dark:text-gray-200">
              {#key compare}
                <div class="inline-flex">
                  <CompareInfo {...advice} pokemon={compare} />
                </div>
                <CompareMoves {...advice} pokemon={compare} />
              {/key}
            </div>
          </Accordion>
        </div>
      </CompareCard>

      <div
        class="mt-2 flex flex-col gap-y-4 rounded-xl py-2 sm:mt-0 sm:gap-y-0 sm:gap-x-2"
      >
        <CompareControls
          class="cc-right absolute top-0.5 -right-8 origin-left translate-x-full rotate-90 transform !bg-transparent"
          pageSize={6}
          controls={false}
          className="flex-1"
          bind:value={j}
          list={gym}
          {select}
        />

        <CompareControls
          class="cc-right absolute top-0.5 -left-8 origin-left rotate-90 transform !bg-transparent"
          on:select={(_) => {
            active = 'team'
            i = -1
          }}
          pageSize={6}
          controls={false}
          className="flex-1"
          bind:value={k}
          list={team}
          {select}
        />

        <CompareControls
          class="flex-1"
          title="Your box"
          on:select={(_) => {
            active = 'box'
            k = -1
          }}
          pageSize={6}
          bind:value={i}
          list={box}
          {select}
        />
      </div>
    {/await}
  {/if}
</section>

<style lang="postcss">
  section {
    min-width: 100%;
  }

  @media (min-width: theme('screens.sm')) {
    section {
      min-width: 360px;
    }
  }

  :global(.cc-right button),
  :global(.cc-left button) {
    @apply -rotate-90 transform;
  }
</style>
