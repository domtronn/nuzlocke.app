<script>
  import { Tabs, Icon, Tooltip, Accordion } from '$lib/components/core'
  import { Plus, Minus } from '$icons'

  import { fade } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'

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
  const set = (id) => () => {
    id == Active.Box ? (teamId = -1) : (boxId = -1)
    active = id
  }

  export let id = null,
    gym,
    team,
    box,
    advice

  const locid = (a) => a.customId || a.location
  const dispatch = createEventDispatcher()

  const onadd = (_) => {
    dispatch('select', compare[0].original)
  }

  $: teamList = team.map((t) => locid(t.original))
  $: boxList = box
    .filter((i) => !teamList.includes(locid(i.original)))
    .sort((a, b) => b.total - a.total)

  let compare
  $: {
    let nTid = Math.max(Math.min(teamId, team.length - 1), 0)
    let nBid = Math.max(Math.min(boxId, boxList.length - 1), 0)

    compare =
      (active === Active.Team && team.length > 0) || boxList.length === 0
        ? [
            { ...team?.[nTid], id: nTid },
            { ...gym?.[gymId], id: gymId }
          ]
        : [
            { ...boxList?.[nBid], id: nBid },
            { ...gym?.[gymId], id: gymId }
          ]
  }

  const hasTeam = team.length > 0
  let tab = 0,
    active = hasTeam ? Active.Team : Active.Box

  let boxId = -1,
    teamId = -1,
    gymId = id ?? 0

  if (active === Active.Team) {
    teamId = 0
  } else {
    boxId = 0
  }
</script>

<CompareCard
  className="mt-8 relative w-full md:min-w-[50ch] rounded-b-lg {$$restProps.class ||
    ''}"
  pokemon={compare}
>
  {#key compare}
    <div
      class:-mb-8={tab !== 0}
      class="relative z-20 bg-white p-4 dark:bg-gray-900"
    >
      <div class="ml-3 mb-4 w-full">
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
      class="relative z-30 flex w-full flex-wrap border-gray-300 bg-white px-5 py-2 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 max-md:rounded-b-lg md:border-t md:py-3 md:pl-8 md:pr-4"
      class:hidden={tab !== 2}
    >
      <CompareMoves calc={advice.calc} pokemon={compare} />
    </div>
  {/key}

  <!-- Accordion info Desktop display -->
  <div
    class="flex hidden flex-col border-gray-200 bg-white pl-4 pr-2 pb-4 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 max-md:rounded-b-lg md:flex md:border-t md:py-3 md:pl-8 md:pr-4"
  >
    <Accordion className="hidden md:flex -ml-4">
      <strong slot="heading" class="inline-flex text-sm"> Info </strong>

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

  <slot name="actions" />
</CompareCard>

{#key boxList}
  <div
    class="mt-1 flex w-full flex-col justify-center {$$restProps.class || ''}"
  >
    <CompareControls
      class="nohighlight !mt-6 !mb-2"
      title="Your box"
      on:select={set(Active.Box)}
      bind:value={boxId}
      showcontrols
      showtitle
      pageSize={6}
      list={boxList}
      {select}
    >
      {#key compare[0]}
        <button
          class="max-md right-0 z-[100] inline-flex items-center gap-x-1 border-b border-gray-400 text-xs text-gray-400 underline-offset-4 transition hover:border-gray-50 hover:text-gray-50"
          on:click={onadd}
        >
          {#if active === Active.Box && teamList.length < 6}
            <Tooltip>Add {compare[0].name} to team</Tooltip>
            <Icon inline icon={Plus} />
            Add to team
          {:else if teamList.length > 1}
            <Tooltip>Remove {compare[0].name} from team</Tooltip>
            <Icon inline icon={Minus} />
            Remove from team
          {/if}
        </button>
      {/key}
    </CompareControls>
  </div>
{/key}

<div
  class="flex flex-row gap-y-4 rounded-xl py-2 sm:mt-0 sm:gap-y-0 sm:gap-x-2 {$$restProps.class ||
    ''}"
>
  <div class="flex-1">
    <CompareControls
      class="mt-2 origin-left max-md:grid max-md:grid-cols-3 md:absolute md:top-0.5 md:-right-8 md:mt-0 md:translate-x-full md:rotate-90 md:transform md:!bg-transparent"
      pageSize={6}
      showcontrols={false}
      bind:value={gymId}
      title="Gym team"
      list={gym}
      {select}
    />
  </div>

  <div class="flex-1">
    {#key team}
      <CompareControls
        class="mt-2 origin-left max-md:grid max-md:grid-cols-3 md:absolute md:top-0.5 md:-left-8 md:mt-0 md:rotate-90 md:transform md:!bg-transparent"
        bind:value={teamId}
        on:select={set(Active.Team)}
        pageSize={6}
        showcontrols={false}
        list={team}
        title="Your team"
        {select}
      />
    {/key}
  </div>
</div>
