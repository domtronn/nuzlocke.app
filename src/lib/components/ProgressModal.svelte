<script>
  export const MODES = { build: 'build', compare: 'compare' }
  export let id = 0,
    mode = MODES.build
  export let boss

  import { onMount, getContext } from 'svelte'

  import { X } from '$icons'
  import { Tabs, Button, IconButton } from '$c/core'
  import { TeamBuildCard, CompareCard, Actions } from '$c/BossBattle'
  import { getGameStore, read, patch,
           readdata, readTeam, readTeams, readBox } from '$lib/store'

  import { toList, regionise, capitalise } from '$lib/utils/string'
  import { nonnull } from '$lib/utils/obj'

  const { getPkmn } = getContext('game')
  const { close } = getContext('simple-modal')

  let tab = mode === MODES.build ? 0 : 1,
    tabs = ['Team', 'Compare']

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

    const teamList = toList(team.map((t) => regionise(capitalise(t.name))))

    if (
      !same &&
      window.confirm(
        `This team is different to your active one, would you like to make ${teamList} your active team?`
      )
    ) {
      gameStore.update(patch({ __team: teamLocs }))
    }

    const teamData = nonnull({
      id: boss.id,
      name: boss.name,
      group: boss.type,
      speciality: boss.speciality,
      team: team.map((i) => ({ sprite: i.alias, id: locid(i.original) }))
    })

    gameStore.update(patch({
      __teams: bossTeams
        .filter(t => t.id !== boss.id)
        .concat(teamData)
    }))

    close()
  }

  const resetTeam = () => (teamLocs = readTeam(rawData))
  const clearTeam = () => (teamLocs = [])
  const toggleMon = (e) => {
    const mon = e.detail
    if (teamLocs.includes(locid(mon))) {
      teamLocs = teamLocs.filter((i) => i !== locid(mon))
    } else {
      if (teamLocs.length === 6) return
      teamLocs = teamLocs.concat(locid(mon))
    }
  }

  // Data and setup functions
  let gameStore, rawData, boxData, teamLocs, ogTeam, bossTeams
  async function setup(cb) {
    const [, , id] = readdata()

    gameStore = getGameStore(id)
    gameStore.subscribe(
      read((data) => {
        rawData = data
        boxData = readBox(data)
        ogTeam = teamLocs = readTeam(data)
        bossTeams = readTeams(data)
        cb(rawData, boxData, teamLocs)
      })
    )
  }

  async function fetchPkmnSet(mons, key = 'pokemon') {
    return await Promise.all(
      mons.map((m) => getPkmn(m[key]).then((res) => ({ original: m, ...res })))
    )
  }

  async function fetchAnalysis(team, box) {
    const boxMons = await fetchPkmnSet(box)
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

  let loading = true
  let analysisResult
  onMount(async () => {
    setup(async (rawData, boxData, teamLocs) => {
      analysisResult = await fetchAnalysis(boss.pokemon, boxData)
      loading = false
    })
  })
</script>

{#if loading}
  Loading
{:else if !analysisResult.box.length}
  <div
    class="rounded-xl bg-white px-6 py-8 text-center text-lg shadow-lg dark:bg-gray-900 dark:text-gray-50"
  >
    <p class="mb-2">
      How do you expect to beat <b>{boss.name}</b> with no Pokémon?
    </p>
    <p class="mb-4">Go back out there and Catch 'em All!</p>

    <IconButton
      borderless
      rounded
      src={X}
      on:click={close}
      containerClassName="fixed top-4 right-4 z-[100]"
    />

    <Button solid rounded on:click={close}>Close</Button>
  </div>
{:else}
  {@const team = teamLocs.map(makeTeam.bind({}, analysisResult.mons))}

  <IconButton
    borderless
    rounded
    src={X}
    on:click={close}
    containerClassName="fixed top-4 right-4 z-[100]"
  />

  <CompareCard
    on:select={toggleMon}
    {team}
    {id}
    class={tab === 1 ? '' : 'hidden'}
    box={analysisResult.box}
    gym={analysisResult.gym}
    advice={analysisResult}
  >
    <Tabs class="flex-1" slot="tabs" bind:active={tab} {tabs} />
    <Actions
      slot="actions"
      on:toggle={settab(0)}
      on:complete={handlesubmit(team)}
      class="justify-center rounded-b-lg bg-white px-6 pt-1 pb-2 dark:bg-gray-900 md:-mt-4"
      {...boss}
      {team}
    >
      <span slot="switch-text">Build team</span>
    </Actions>
  </CompareCard>

  <TeamBuildCard
    on:select={toggleMon}
    on:clear={clearTeam}
    on:reset={resetTeam}
    {team}
    {boss}
    class={tab === 0 ? '' : 'hidden'}
    box={analysisResult.box}
    gym={analysisResult.gym}
    summary={analysisResult.summary}
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
