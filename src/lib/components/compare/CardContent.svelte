<script>
  import { Accordion, Tabs, Icon } from '$lib/components/core'
  import { Plus, Minus } from '$icons'
  import {
    CompareStats,
    CompareCard,
    CompareControls,
    CompareInfo,
    CompareMoves
  } from './'

  const Active = {
    Team: 0,
    Gym: 1,
    Box: 2
  }

  const select = (p) => p?.sprite
  const unset = (id) => {
    id == Active.Gym ? (gymId = -1) : (teamId = -1)
    active = id
  }

  export let gym, team, box, advice

  $: compare =
    active === Active.Team
      ? [
          { ...team[teamId], id: teamId },
          { ...gym[gymId], id: gymId }
        ]
      : [
          { ...box[boxId], id: boxId },
          { ...gym[gymId], id: gymId }
        ]

  $: {
    console.log('compare', compare)
    console.log('gym', gym)
    console.log('team', team)
    console.log('box', box)
    console.log('advice', advice)
  }

  let tab = 0,
    active = Active.Team

  let boxId = -1,
    gymId = 0,
    teamId = 0
</script>

<CompareCard class="mt-12" pokemon={compare}>
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
    <Accordion className="hidden md:flex flex-row-reverse justify-between">
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
          <Icon inline={true} height="0.8em" icon={Plus} class={className} />
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
  <!-- <CompareControls -->
  <!--   class="cc-right absolute top-0.5 -right-8 origin-left translate-x-full rotate-90 transform !bg-transparent" -->
  <!--   pageSize={6} -->
  <!--   controls={false} -->
  <!--   className="flex-1" -->
  <!--   bind:value={gymId} -->
  <!--   list={gym} -->
  <!--   {select} -->
  <!-- /> -->

  <!-- <CompareControls -->
  <!--   class="cc-right absolute top-0.5 -left-8 origin-left rotate-90 transform !bg-transparent" -->
  <!--   on:select={unset(Active.Team)} -->
  <!--   pageSize={6} -->
  <!--   controls={false} -->
  <!--   className="flex-1" -->
  <!--   bind:value={teamId} -->
  <!--   list={team} -->
  <!--   {select} -->
  <!-- /> -->

  <!-- <CompareControls -->
  <!--   class="flex-1" -->
  <!--   title="Your box" -->
  <!--   on:select={unset(Active.Box)} -->
  <!--   pageSize={6} -->
  <!--   bind:value={boxId} -->
  <!--   list={box} -->
  <!--   {select} -->
  <!-- /> -->
</div>
