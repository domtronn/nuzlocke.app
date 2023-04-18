<script>
  export const MODES = { build: 'build', compare: 'compare' }
  export let id = 0,
    mode = MODES.build
  export let boss

  import deferStyles from '$lib/utils/defer-styles'
  import { onMount, getContext } from 'svelte'

  import { X } from '$icons'
  import { Tabs, IconButton } from '$c/core'
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

  const settab = (i) => () => (tab = i)
  const handlesubmit = (team) => () => {
    const teamLocs = team.map((o) => locid(o.original))
    const same =
      teamLocs.every((it, i) => ogTeam[i] === it) &&
      teamLocs.length === ogTeam.length

    if (
      !same &&
      window.confirm(
        'Your team is different, would you like to make {YOUR TEAM HERE} your active team?'
      )
    ) {
      console.log('Setting team to', teamLocs)
    }

    console.log('Setting victory to', {
      id: boss.id,
      team: team.map((i) => ({ pokemon: i.alias, id: locid(i.original) }))
    })
  }

  const resetTeam = () => (teamLocs = readTeam(rawData))
  const clearTeam = () => (teamLocs = [])
  const toggleMon = (e) => {
    debugger
    const mon = e.detail
    if (teamLocs.includes(locid(mon))) {
      teamLocs = teamLocs.filter((i) => i !== locid(mon))
    } else {
      if (teamLocs.length === 6) return
      teamLocs = teamLocs.concat(locid(mon))
    }
  }

  // Data and setup functions
  let gameStore, rawData, boxData, teamLocs, ogTeam
  async function setup() {
    const [, , id] = readdata()

    gameStore = getGameStore(id)
    gameStore.subscribe(
      read((data) => {
        rawData = data
        boxData = readBox(data)
        ogTeam = teamLocs = readTeam(data)
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

      <IconButton
        borderless
        rounded
        src={X}
        on:click={close}
        containerClassName="fixed top-4 right-4 z-[100]"
      />

      {#if tab === 1}
        <CompareCard on:select={toggleMon} {id} {team} {box} {gym} {advice}>
          <Tabs class="flex-1" slot="tabs" bind:active={tab} {tabs} />
          <Actions
            slot="actions"
            on:toggle={settab(0)}
            on:complete={handlesubmit(team)}
            class="justify-center rounded-b-lg bg-white px-6 pt-1 pb-2 dark:bg-gray-900 md:-mt-8"
            {...boss}
            {team}
          >
            <span slot="switch-text">Build team</span>
          </Actions>
        </CompareCard>
      {:else}
        <TeamBuildCard
          on:select={toggleMon}
          on:clear={clearTeam}
          on:reset={resetTeam}
          {team}
          {box}
          {gym}
          {boss}
          {summary}
        >
          <Tabs slot="tabs" bind:active={tab} {tabs} />
          <Actions
            slot="actions"
            on:toggle={settab(1)}
            on:complete={handlesubmit(team)}
            {...boss}
            {team}
          >
            <span slot="switch-text">Compare team</span>
          </Actions>
        </TeamBuildCard>
      {/if}
    {/await}
  {/key}
{/await}
