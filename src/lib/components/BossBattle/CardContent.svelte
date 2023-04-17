<script>
  import { createEventDispatcher } from 'svelte'
  import { Heading, Body, Team, Vs } from './'
  import { Button, PIcon } from '$c/core'
  import { toList, regionise, capitalise } from '$lib/utils/string'

  const dispatch = createEventDispatcher()
  const compare = () => dispatch('compare')

  export let gym = [],
    team = [],
    box = []

  export let boss = {},
    summary = {}

  function format(poke) {
    return (
      poke.original.nickname || regionise(capitalise(poke.original.pokemon))
    )
  }

  function sumStats(pokes) {
    return pokes.reduce((acc, it) => acc + it.total, 0)
  }
</script>

<section class="shadow-lg">
  <Heading atkStats={sumStats(team)} defStats={sumStats(gym)} {boss} />

  <div
    class="absolute top-2 z-20 h-20 w-full items-center justify-between md:top-6 md:inline-flex"
  >
    <div class="h-1/2 w-full flex-1 md:h-full md:w-auto">
      <Team type="attack" {team} />
    </div>

    <Vs
      class="max-md:absolute max-md:top-1/4 max-md:right-1/4 max-md:-translate-x-1/2 max-md:-translate-y-1/2"
    />

    <div class="h-1/2 w-full flex-1 md:h-full md:w-auto">
      <Team type="defend" team={gym} />
    </div>
  </div>

  <Body
    on:clear
    on:reset
    on:select
    recommendations={summary.recommendations}
    advice={summary.advice}
    name={boss.name}
    {box}
    {team}
  >
    <svelte:fragment slot="tabs">
      <slot name="tabs" />
    </svelte:fragment>

    <!-- TODO: Fix separation of badge/victory -->
    <!-- TODO: Verify team vs saved team and offer to update -->
    <!-- TODO: Heading gradient builder from team members and types -->

    <div class="order-3 md:w-full">
      <p class=" my-2 text-center text-xs italic opacity-50 md:text-right">
        Claim the badge from <b>{boss.name}</b> to mark this boss as
        <b>complete</b><br class="hidden md:block" />
        with your team of {toList(team.map(format))}
      </p>

      <div class="mt-4 mb-4 flex justify-center gap-x-2 md:justify-end">
        <Button class="text-xs md:text-base" on:click={compare} rounded
          >Compare team</Button
        >
        <Button class="claim text-xs md:text-base" solid rounded>
          Claim badge
          <PIcon class="coin -mt-3 md:ml-2" type="b" name="stone" />
        </Button>
      </div>
    </div>
  </Body>
</section>
