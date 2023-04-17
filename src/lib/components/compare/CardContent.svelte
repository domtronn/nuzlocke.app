<script>
  import { Tabs } from '$lib/components/core'

  import {
    CompareStats,
    CompareCard,
    CompareControls,
    CompareInfo,
    CompareMoves
  } from './'

  const Active = {
    Gym: 0,
    Team: 1,
    Box: 2
  }

  const select = (p) => p?.original?.icon || p?.sprite

  export let id = null,
    gym,
    team,
    box,
    advice

  $: compare =
    active === Active.Team
      ? [
          {
            ...team?.[normalisedTid],
            id: normalisedTid
          },
          { ...gym?.[gymId], id: gymId }
        ]
      : [
          { ...box?.[boxId], id: boxId },
          { ...gym?.[gymId], id: gymId }
        ]

  $: normalisedTid = Math.min(teamId, team.length - 1)

  let tab = 0,
    active = Active.Team

  let boxId = -1,
    gymId = id ?? 0,
    teamId = 0
</script>

{#if team.length === 0}{:else}
  <CompareCard
    className="mt-8 relative w-full md:min-w-[50ch] rounded-b-lg"
    pokemon={compare}
  >
    {#key compare}
      <div
        class:-mb-8={tab !== 0}
        class="relative z-20 bg-white p-4 dark:bg-gray-900"
      >
        <div class="mb-4 w-full">
          <slot name="tabs" />
        </div>

        <Tabs
          bind:selected={tab}
          className="scale-90 z-50 origin-left md:hidden w-fit justify-start -mt-3 mb-4 "
          name="page"
          tabs={['Stats', 'Info', 'Moves']}
        />

        <div class="flex flex-row gap-x-2">
          <CompareStats hide={tab !== 0} pokemon={compare} side="left" />
          <CompareStats
            hide={tab !== 0}
            pokemon={[...compare].reverse()}
            side="right"
          />
        </div>
      </div>

      <div
        class="relative z-30 flex flex-wrap border-gray-300 bg-white py-4 pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 md:border-t md:py-3 md:pl-8 md:pr-4"
        class:hidden={tab !== 1}
      >
        <CompareInfo {...advice} pokemon={compare} />
      </div>

      <div
        class="relative z-30 flex w-full flex-wrap border-gray-300 bg-white py-4 pl-8 pr-8 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 max-md:rounded-b-lg md:border-t md:py-3 md:pl-8 md:pr-4"
        class:hidden={tab !== 2}
      >
        <CompareMoves calc={advice.calc} pokemon={compare} />
      </div>
    {/key}

    <!-- Accordion info Desktop display -->
    <div
      class="hidden border-gray-200 bg-white pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 max-md:rounded-b-lg md:flex md:border-t md:py-3 md:pl-8 md:pr-4"
    >
      <div class="text-gray-800 dark:text-gray-200">
        {#key compare}
          <div class="inline-flex">
            <CompareInfo {...advice} pokemon={compare} />
          </div>
          <CompareMoves {...advice} pokemon={compare} />
        {/key}
      </div>
    </div>

    <slot name="actions" />
  </CompareCard>

  <div
    class="mt-2 flex flex-col gap-y-4 rounded-xl py-2 sm:mt-0 sm:gap-y-0 sm:gap-x-2"
  >
    <CompareControls
      class="origin-left md:absolute md:top-0.5 md:-right-6 md:translate-x-full md:rotate-90 md:transform md:!bg-transparent"
      pageSize={6}
      controls={false}
      bind:value={gymId}
      title="Gym team"
      list={gym}
      {select}
    />

    {#key team}
      <CompareControls
        class="origin-left md:absolute md:top-0.5 md:-left-6 md:rotate-90 md:transform md:!bg-transparent"
        bind:value={teamId}
        pageSize={6}
        controls={false}
        list={team}
        title="Your team"
        {select}
      />
    {/key}
  </div>
{/if}
