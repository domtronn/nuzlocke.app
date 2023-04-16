<script>
  import { Heading, Body, Team, Vs } from './'

  export let gym = [],
    team = [],
    box = []

  $: {
    console.log('gym', gym)
    console.log('team', team)
    console.log('box', box)
  }

  export let boss = {},
    summary = {}

  $: width = 48 * Math.max(gym.length, team.length, 4)
</script>

<section style="--w: {width}px">
  <Heading {boss} />

  <div class="inline-flex w-full items-end justify-around">
    <Team {width} type="attack" {team} />
    <Vs />
    <Team {width} type="defend" team={gym} />
  </div>

  <Body
    on:select
    name={boss.name}
    recommendations={summary.recommendations}
    {box}
    {team}
  />
</section>
