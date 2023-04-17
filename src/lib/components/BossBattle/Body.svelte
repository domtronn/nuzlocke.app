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
  class="rec-card relative mx-auto h-auto rounded-b-lg bg-white px-8 py-4 dark:bg-gray-900"
>
  <div class="mx-auto flex w-[48ch] flex-wrap items-start">
    <slot name="tabs" />

    <hr class="-mb-2 !opacity-0" />

    <BoxTeam on:clear on:reset on:select {team} {box} boss={{ name }} />

    <hr class="mt-4 mb-4" />

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

    <div class="min-w-1/2 flex flex-1 flex-col justify-start">
      <Advice types={advice.weak}>
        <p>{name}'s team are <b class="dark:text-gray-400">all</b> weak to:</p>
      </Advice>

      <Advice types={advice.resist}>
        <p>
          {name}'s team are <b class="dark:text-gray-400">all</b> resistant to:
        </p>
      </Advice>

      <Advice types={advice.immunity}>
        <p>{name}'s team have immunities to:</p>
      </Advice>
    </div>

    <div class="min-w-1/2 flex-1">
      <ul
        class:-mt-5={advice.weak?.length ||
          advice.resist?.length ||
          advice.immunity?.length}
        class="my-2 flex justify-start gap-x-6"
      >
        {#each recommendations.slice(0, 3) as poke, i}
          <Recommendation {...poke} {i} />
        {/each}
      </ul>
      {#if advice.dmgclass}
        {@const dclass = advice.dmgclass[0]}
        {@const defclass =
          dclass === 'physical' ? 'Defense' : 'Special Defense'}
        <p class="mt-2 w-full text-center text-xs italic">
          {name}'s team only uses <b>{dclass}</b> moves. <br />
          You should use Pokemon with a high <b>{defclass}</b> stat.
        </p>
      {/if}
    </div>

    <hr class="mt-4" />

    <slot />
  </div>
</div>

<style>
  hr {
    height: 1px;
    @apply w-full bg-gray-900 opacity-90;
  }

  :global(.dark) hr {
    @apply bg-white opacity-10;
  }

  p {
    @apply text-xs italic text-gray-500;
  }
  h2 {
    @apply text-sm font-bold;
  }
</style>
