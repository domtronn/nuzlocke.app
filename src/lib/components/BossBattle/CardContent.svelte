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

  $: width = Math.max(gym.length, team.length, 4) > 4 ? 240 : 240
  $: width, console.log('width', width, Math.max(gym.length, team.length, 4))
</script>

<section style="--w: {width}px" class="shadow-lg">
  <Heading {boss} />

  <div class="inline-flex w-full items-end justify-between">
    <Team {width} type="attack" {team} />
    <Vs />
    <Team {width} type="defend" team={gym} />
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

    <div class="w-full">
      <p class="my-2 text-right text-xs italic opacity-50">
        Claim the badge from <b>{boss.name}</b> to mark this boss as
        <b>complete</b><br />
        with your team of {toList(team.map(format))}
      </p>

      <div class="mt-4 mb-4 flex justify-end gap-x-2">
        <Button on:click={compare} rounded>Compare team</Button>
        <Button class="claim" solid rounded>
          Claim badge
          <PIcon class="coin -mt-3 ml-2" type="b" name="stone" />
        </Button>
      </div>
    </div>
  </Body>
</section>
