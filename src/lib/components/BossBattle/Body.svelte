<script>
  import { Recommendation, BoxTeam, Advice } from './'

  import TypeLogo from '$c/type-logo.svelte'
  import { Icon, Tooltip, Accordion } from '$c/core'
  import { Info } from '$icons'

  import { summarise } from '$utils/types'
  import { capitalise } from '$utils/string'

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

    <BoxTeam on:clear on:reset on:select {team} {box} boss={{ name }} />

    <Accordion className="md:-ml-4 -mb-2 py-2">
      <h2 slot="heading">Team analysis</h2>
      <div
        slot="item"
        class="mt-4 mb-2 flex flex-wrap items-center justify-center gap-1 gap-y-4"
      >
        {#key team}
          {#await summarise(team) then result}
            {#if result.result}
              {#each result.result as [type, { resist = 0, weak = 0 }]}
                <div class="grid-rows-13 grid gap-1">
                  {#each Array(result.max - resist).fill() as _}
                    <span class="h-1 w-8 rounded-sm bg-gray-700" />
                  {/each}
                  {#each Array(resist).fill() as _}
                    <span class="h-1 w-8 rounded-sm bg-green-500" />
                  {/each}
                  <TypeLogo class="scale-75" {type}>
                    <p class="py-2 px-1 text-center">
                      <b>{resist || 'None'}</b>
                      of your Team resist{resist === 1 ? 's' : ''}
                      <b>{capitalise(type)}</b>
                      <br />
                      <b>{weak || 'None'}</b> of your Team {weak === 1
                        ? 'is'
                        : 'are'} weak to
                      <b>{capitalise(type)}</b>
                    </p>
                  </TypeLogo>
                  {#each Array(weak).fill() as _}
                    <span class="h-1 w-8 rounded-sm bg-red-500" />
                  {/each}
                  {#each Array(result.max - weak).fill() as _}
                    <span class="h-1 w-8 rounded-sm bg-gray-700" />
                  {/each}
                </div>
              {/each}
            {/if}
          {/await}
        {/key}
      </div>
    </Accordion>

    <Accordion className="md:-ml-4 -mb-2">
      <h2 slot="heading" class="my-4 inline-flex w-full">
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

      <div slot="item" class="flex w-auto flex-wrap">
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

        <div class="md:min-w-1/2 flex w-full flex-col justify-start md:flex-1">
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
      </div>
    </Accordion>

    <slot />
  </div>
</div>

<style>
  p {
    @apply text-xs italic text-gray-500 max-md:text-center;
  }
  h2 {
    @apply text-sm font-bold;
  }
</style>
