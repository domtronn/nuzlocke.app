<script>
  import { Recommendation, BoxTeam } from './'
  import { createEventDispatcher } from 'svelte'
  import { PIcon, Icon, Tooltip } from '$c/core'
  import { Info } from '$icons'

  const dispatch = createEventDispatcher()
  const locid = (poke) => poke.customId || poke.location
  const select = (data) => () => dispatch('select', data)

  export let name,
    team = [],
    box = [],
    recommendations = []
</script>

<div
  class="rec-card relative mx-auto h-auto rounded-b-lg bg-white px-8 py-4 dark:bg-gray-900"
>
  <div class="mx-auto w-[48ch]">
    <h2 class="mb-2 inline-flex">
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

    <ul class="-ml-6 mb-2 flex justify-center gap-x-14">
      {#each recommendations.slice(0, 3) as poke, i}
        <Recommendation {...poke} {i} />
      {/each}
    </ul>

    <BoxTeam on:select {team} {box} />

    <slot />
  </div>
</div>

<style>
  h2 {
    @apply text-sm font-bold;
  }

  p {
    @apply mb-2 text-xs italic opacity-50;
  }
</style>
