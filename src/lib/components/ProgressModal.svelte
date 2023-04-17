<script>
  export const MODES = { build: 'build', compare: 'compare' }
  export let id = 0,
    mode = MODES.build
  export let boss

  import deferStyles from '$lib/utils/defer-styles'
  import { onMount, getContext } from 'svelte'

  import { Tabs } from '$c/core'
  import { TeamBuildCard, CompareCard, Actions } from '$c/BossBattle'
  import { getGameStore, read, readdata, readTeam, readBox } from '$lib/store'

  onMount(async () => {
    deferStyles(
      '/assets/items.css?i=wonder-launcher-x-sp-def-2,wonder-launcher-dire-hit-1,wonder-launcher-x-attack-3'
    )
  })

  const { getPkmn } = getContext('game')
  const { close } = getContext('simple-modal')

  let tab = mode === MODES.build ? 0 : 1,
    tabs = ['Team builder', 'Compare']

  // Util Functions
  const locid = (a) => a.customId || a.location
  const makeTeam = (mons, location) =>
    mons.find((m) => locid(m.original) === location)

  // Data and setup functions
  let gameStore, rawData, boxData, teamLocs
  async function setup() {
    const [, , id] = readdata()

    gameStore = getGameStore(id)
    gameStore.subscribe(
      read((data) => {
        rawData = data
        boxData = readBox(data)
        teamLocs = readTeam(data)
      })
    )
  }

  async function fetchPkmnSet(mons, key = 'pokemon') {
    return await Promise.all(
      mons.map((m) => getPkmn(m[key]).then((res) => ({ original: m, ...res })))
    )
  }

  async function fetchAnalysis(team) {
    const boxMons = await fetchPkmnSet(boxData)
    const gymMons = await fetchPkmnSet(team, 'name')

    const res = await fetch('/api/battle/advice.json', {
      method: 'POST',
      body: JSON.stringify({
        box: boxMons,
        team: gymMons
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const advice = await res.json()
    return {
      ...advice,
      box: boxMons,
      gym: gymMons,
      mons: boxMons.concat(gymMons)
    }
  }
</script>

{#await setup() then}
  {#key (boss.id, tab)}
    {#await fetchAnalysis(boss.pokemon) then { summary, box, mons, gym, ...advice }}
      {@const team = teamLocs.map(makeTeam.bind({}, mons))}
      {#if tab === 1}
        <CompareCard {id} {team} {box} {gym} {advice}>
          <Tabs class="flex-1" slot="tabs" bind:active={tab} {tabs} />
          <Actions
            class="justify-center rounded-b-lg bg-white px-6 pt-1 pb-2 dark:bg-gray-900"
            {...boss}
            {team}
            slot="actions"
          >
            <span slot="switch-text">Build team</span>
          </Actions>
        </CompareCard>
      {:else}
        <TeamBuildCard {team} {box} {gym} {boss} {summary}>
          <Tabs slot="tabs" bind:active={tab} {tabs} />
          <Actions {...boss} {team} slot="actions">
            <span slot="switch-text">Compare team</span>
          </Actions>
        </TeamBuildCard>
      {/if}
    {/await}
  {/key}
{/await}
