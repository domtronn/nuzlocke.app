<script>
  import { Recommendation, BoxTeam, Advice } from './'
  import { Icon, Tooltip } from '$c/core'
  import { Info } from '$icons'

  export let name,
    team = [],
    box = [],
    recommendations = [],
    advice = {}
</script>

<div
  class="rec-card relative z-20 mx-auto h-auto translate-y-20 rounded-b-lg bg-white px-4 py-2 dark:bg-gray-900 md:translate-y-24 md:py-4 md:px-8 md:pb-2"
>
  <div
    class="mx-auto flex w-auto flex-wrap items-start pt-2 md:w-[48ch] md:pt-0"
  >
    <slot name="tabs" />

    <hr class="-mb-2 !opacity-0" />

    <BoxTeam on:clear on:reset on:select {team} {box} boss={{ name }} />

    <hr class="my-2 md:my-4" />

    <h2 class="inline-flex w-full">
      Recommendations
      <span class="ml-2 cursor-help">
        <Icon class="inline scale-150" inline icon={Info} />
        <Tooltip side="right">
          Based on {name}'s team's movesets, weaknesses and your Pokemon's
          beneficial stats and both resistive and offesnsive potential. You
          should still use your own knowledge to properly craft a team.
        </Tooltip>
      </span>
    </h2>

    <div class="md:min-w-1/2 w-full md:flex-1">
      <ul class="my-2 flex justify-around gap-x-6 md:justify-start">
        {#each recommendations.slice(0, 3) as poke, i}
          <Recommendation {...poke} {i} />
        {/each}
      </ul>
      {#if advice.dmgclass}
        {@const dclass = advice.dmgclass[0]}
        {@const defclass =
          dclass === 'physical' ? 'Defense' : 'Special Defense'}
        <p
          class="mt-2 w-auto text-center text-xs italic max-md:mb-2 md:text-left"
        >
          {name}'s team only uses <b>{dclass}</b> moves.
          <br class="hidden md:block" />
          You should use Pokemon with a high <b>{defclass}</b> stat.
        </p>
      {/if}
    </div>

    <div
      class:md:-mt-5={advice.weak?.length ||
        advice.resist?.length ||
        advice.immunity?.length}
      class="md:min-w-1/2 flex w-full flex-col justify-start md:flex-1"
    >
      <Advice types={advice.weak}>
        {name}'s team are <b class="dark:text-gray-400">all</b> weak to:
      </Advice>

      <Advice types={advice.resist}>
        {name}'s team are <b class="dark:text-gray-400">all</b> resistant to:
      </Advice>

      <Advice types={advice.immunity}>
        {name}'s team have immunities to:
      </Advice>
    </div>

    <slot />
  </div>
</div>

<style>
  hr {
    height: 1px;
    @apply w-full bg-gray-900 opacity-0 md:opacity-90;
  }

  :global(.dark) hr {
    @apply bg-white opacity-0 md:opacity-10;
  }

  p {
    @apply text-xs italic text-gray-500 max-md:text-center;
  }
  h2 {
    @apply text-sm font-bold;
  }
</style>
