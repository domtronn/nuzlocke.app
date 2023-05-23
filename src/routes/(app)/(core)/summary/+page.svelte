<script>
  let count = 0
  let data

  import Section from './Summary/Section.svelte'
  import { Doughnut, Radar } from 'svelte-chartjs'

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    ArcElement,
    RadialLinearScale,
    LineElement
  } from 'chart.js'

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    PointElement,
    ArcElement,
    RadialLinearScale,
    LineElement
  )

  import { Grave } from '../graveyard'

  import { color } from '$lib/data/colors.ts'
  import { Wrapper as SettingWrapper } from '$lib/components/Settings'

  import { onMount, getContext } from 'svelte'
  import { PIcon, Icon, Logo } from '$c/core'
  import { Deceased } from '$icons'

  import { readdata, readTeam, readTeams, summarise } from '$lib/store'
  import { regionise, capitalise } from '$utils/string'
  import { IMG, createImgUrl } from '$utils/rewrites'
  import { toObj } from '$utils/obj'
  import { insertList } from '$utils/arr'
  import { locid } from '$utils/pokemon'

  const { getPkmns, getLeague, getRoute } = getContext('game')
  const median = (arr) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b)
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
  }

  const mean = (arr) => {
    return Math.round(arr.reduce((acc, it) => acc + +it, 0) / arr.length)
  }

  let team,
    teamLocs,
    teamsFilters,
    teams,
    box,
    all,
    league,
    graveyard,
    loading = true

  let filter = 'gym-leader'
  let radarData, donutData, pokemonData

  let routes, gantt, savedata, maxgantt, teamMap, metaData

  onMount(() => {
    const [gameData, game, , meta] = readdata()
    metaData = meta
    savedata = gameData
    teamLocs = readTeam(gameData)
    team = teamLocs.map((loc) => gameData[loc])
    teams = readTeams(gameData)
    teamsFilters = [...new Set(teams.map((t) => t.group))]

    const toGantt = [
      ...new Set(teams.map((t) => t.team.map((t) => t.id)).flat())
    ]

    getRoute(game).then((data) => {
      routes = insertList(data, gameData.__custom || [])
      console.log(routes, teams)

      //  need to add in custom locations

      teamMap = teams.reduce(
        (ac, it) => ({
          ...ac,
          [it.id]: it.team
        }),
        {}
      )

      const latestnav = (routes, game) => {
        const custom = (game?.__custom || []).reduce(
          (acc, c) => ({ ...acc, [c.id]: true }),
          {}
        )
        const locations = new Set(
          Object.entries(game)
            .filter(([id, loc]) => loc.pokemon && !!loc.status && !custom[id])
            .map(([, i]) => i.location)
        )

        let i = 0
        while (
          i < routes.length &&
          (locations.size || routes[i].type !== 'route')
        ) {
          locations.delete(routes[i]?.name)
          i++
        }

        const r = routes[Math.min(i, routes.length - 1)]
        return { ...r, id: i }
      }

      gantt = toGantt.reduce((acc, locid) => {
        //  Need to create one span for time in box - time from capture to time dead/still in box, either last appearance if status is dead _or_ look at dath inofmration
        //  Need to create multiple spans for time in team, calculate gaps of fights, e.g. [1,2,3,4,5,6] if they're in [1,2,3,5,6] it should produe [[1,3],[5,6]
        let gotindex = routes.findIndex(
          (l) =>
            (l.id === locid || l.name === locid) &&
            (l.type === 'route' || l.type == 'custom')
        )

        if (!gameData[locid]) return acc
        const isdead = gameData[locid]?.status === 5

        const maxindex = latestnav(routes, gameData).id || routes.length
        maxgantt = maxindex
        let lostindex = maxindex
        if (isdead) {
          const deathloc = gameData[locid]?.death?.location?.name

          if (deathloc) {
            lostindex = routes.findIndex((r) => r.name === deathloc)
          } else {
            lostindex = routes.reduce((acc, l, i) => {
              if (
                l.type === 'gym' &&
                (teamMap[l.value]?.map((i) => i.id) || []).includes(locid)
              )
                return i

              return acc
            }, 0)
          }
        }

        const topct = (i) => (i / maxindex) * 95
        const gotspan = [gotindex, lostindex].map(topct)

        let gymIndex = 0
        const gymindex = routes.reduce((acc, l, i) => {
          if (l.type === 'gym' && teamMap[l.value]) gymIndex += 1
          if (
            l.type === 'gym' &&
            teamMap[l.value] &&
            (teamMap[l.value]?.map((i) => i.id) || []).includes(locid)
          )
            return acc.concat([[i, gymIndex]])
          return acc
        }, [])

        const groupedgymindex = gymindex.reduce((acc, [spanid, seqid], i) => {
          if (i === 0) return [[[spanid, seqid]]]

          const [last, ...rest] = [...acc].reverse()
          if (seqid - 1 === last?.[last.length - 1]?.[1])
            return [...rest.reverse(), (last || []).concat([[spanid, seqid]])]
          else return acc.concat([[[spanid, seqid]]])
        }, [])

        const gymspans = groupedgymindex.map((g) => {
          const first = g[0]
          const last = g[g.length - 1]

          return [first[0], last[0]].map(topct)
        })

        return {
          ...acc,
          [gameData[locid].pokemon]: {
            gotspan: gotspan,
            bossspan: gymspans,
            mon: gameData[locid]
          }
        }
      }, {})
    })

    summarise(({ available, deceased }) => {
      all = available
      box = available.filter((i) => !teamLocs.includes(i.location))
      graveyard = deceased

      getLeague(game, gameData.__starter).then((data) => {
        league = data
      })

      getPkmns(available.map((p) => p.pokemon)).then((data) => {
        const allData = Object.values(data)
        const statAgg = {
          hp: allData.map((d) => d.baseStats.hp),
          atk: allData.map((d) => d.baseStats.atk),
          def: allData.map((d) => d.baseStats.def),
          spa: allData.map((d) => d.baseStats.spa),
          spd: allData.map((d) => d.baseStats.spd),
          spe: allData.map((d) => d.baseStats.spe),
          total: allData.map((d) => d.total)
        }

        const countedTypes = allData.reduce(
          ([p, d], it) => {
            const pType = it.types[0]
            const sType = it.types[1]
            const jType = it.types[0] + '/' + (it.types[1] || it.types[0])
            return [
              {
                ...p,
                [pType]: (p[pType] || 0) + 1,
                ...(sType ? { [sType]: (p[sType] || 0) + 1 } : {})
              },
              {
                ...d,
                [jType]: (d[jType] || 0) + 1
              }
            ]
          },
          [{}, {}]
        )

        donutData = countedTypes

        const statAggObj = (f, obj) =>
          Object.fromEntries(
            Object.entries(obj).map(([key, val]) => [key, f(val)])
          )
        const medianStatAgg = statAggObj(median, statAgg)
        const meanStatAgg = statAggObj(mean, statAgg)

        const pick = (arr, obj) => arr.map((key) => obj[key])

        radarData = {
          labels: ['HP', 'Atk', 'Def', 'Sp. Atk', 'Sp. Def', 'Speed'],
          datasets: [
            {
              label: 'Median Box Stats',
              backgroundColor: '#e95678',
              borderColor: '#e95678',
              data: pick(
                ['hp', 'atk', 'def', 'spa', 'spd', 'spe'],
                medianStatAgg
              )
            },
            {
              label: 'Mean Box Stats',
              backgroundColor: '#b877db',
              borderColor: '#b877db',
              data: pick(['hp', 'atk', 'def', 'spa', 'spd', 'spe'], meanStatAgg)
            }
          ]
        }

        pokemonData = data
        loading = false
      })
    })(gameData)
  })
</script>

{#if !loading}
  <header class="mx-12 mb-2 flex items-center px-4 py-2">
    <Logo
      src="/assets/{metaData.game}"
      pictureClass="game--{metaData.game}"
      class="h-16 w-auto max-md:pt-2 md:mr-4 md:h-16"
      alt="{metaData.game} logo"
      aspect="382x196"
    />
    <h1 class="text-4xl font-bold">{metaData.name}</h1>
    <div class="h-px flex-1 bg-blue-200" />
  </header>

  <main class="mx-12 px-4 pb-48">
    <Section id="team" class="grid grid-cols-3 gap-4 rounded-lg">
      <svelte:fragment slot="heading">Team</svelte:fragment>

      {#each team as p}
        <div class="-bg-green-500 inline-flex items-center">
          <img src={createImgUrl(pokemonData[p.pokemon], { ext: 'png' })} />
          <div>
            <h2 class="-mb-1 text-lg font-bold">
              {p.nickname}
            </h2>
            <h3 class="text-sm">
              the {capitalise(p.nature)}
              {regionise(capitalise(p.pokemon))}
            </h3>
            <p class="text-xs">
              {#if p.location === 'Starter'}
                Met in a fateful encounter
              {:else if p.status === 2}
                Obtained from {p.location || p.customName}
              {:else if p.status === 3}
                Received in a trade {(p.customName || p.location).startsWith(
                  'Route'
                )
                  ? 'on'
                  : 'at'}
                {p.customName || p.location}
              {:else if !p.location}
                Met in an unknown place
              {:else if p.customName}
                Met {p.customName.startsWith('Route') ? 'on' : 'in'}
                {p.customName}
              {:else}
                Met {p.location.startsWith('Route') ? 'on' : 'at'}
                {p.location}
              {/if}
            </p>
          </div>
        </div>
      {/each}
    </Section>

    <Section id="badges" class="flex flex-wrap items-center gap-4">
      <svelte:fragment slot="heading">BADGES</svelte:fragment>

      {#each Array(8).fill() as p}
        <div class="h-12 w-12" />
      {/each}
    </Section>

    <Section id="bossfights" class="flex flex-col items-center gap-4">
      <svelte:fragment slot="heading">Bossfights</svelte:fragment>

      {#each teams.filter((t) => t.group === 'gym-leader') as team}
        <div class="flex w-full flex-row items-center">
          {#if league}
            <img
              class="w-26 h-20 -scale-x-100 grayscale"
              src={IMG + league[team.id].img + '.png'}
            />
          {/if}
          <div class="flex flex-row">
            {#each team.team as p}
              {@const monData = pokemonData[p.sprite]}
              {@const sprite = p.sprite}

              <img
                class="inline h-16 w-16"
                src={createImgUrl(pokemonData[p.sprite], { ext: 'png' })}
              />
            {/each}
          </div>
        </div>
      {/each}
    </Section>

    <Section id="box" class="mx-auto flex flex-wrap items-center !pt-4">
      <svelte:fragment slot="heading">box</svelte:fragment>

      {#each box as p}
        <PIcon class="-m-2" name={p.pokemon} />
      {/each}
    </Section>

    <Section id="graveyard" class="flex flex-wrap items-center pb-6">
      <svelte:fragment slot="heading">graveyard</svelte:fragment>

      {#each graveyard as p, i}
        <Grave class="!-mx-4 !-mt-4" {...p} id={i} />
      {/each}
    </Section>

    <Section id="stats" class="flex flex-col-reverse items-center gap-4">
      <svelte:fragment slot="heading">Stats</svelte:fragment>

      {#if radarData}
        <Radar
          data={radarData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } }
          }}
        />
      {/if}
      {#if donutData}
        <SettingWrapper id="theme" let:setting={themeId}>
          {@const data = {
            labels: Object.keys(donutData[0]).sort((a, b) =>
              a[0].localeCompare(b[0])
            ),
            datasets: [
              {
                borderWidth: 0,
                backgroundColor: Object.keys(donutData[0])
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map((type) => color(type, themeId)),
                data: Object.entries(donutData[0])
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map((i) => ({ id: i[0], value: i[1] }))
              }
            ]
          }}

          <Doughnut
            {data}
            options={{
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </SettingWrapper>
      {/if}
    </Section>

    <Section id="timeline" class="col-span-5 w-full">
      <svelte:fragment slot="heading">Run Timeline</svelte:fragment>

      {#if gantt}
        <div class="mx-8 mt-4 -mb-2 w-full -translate-x-4 overflow-hidden py-8">
          {#each Object.entries(gantt).sort((a, b) => a[1].bossspan[0] - b[1].bossspan[0]) as [key, { gotspan, bossspan, mon }], i}
            {@const minspan = Math.min(
              gotspan[0],
              ...bossspan.map((i) => i[0])
            )}
            {@const maxspan = Math.max(
              gotspan[1],
              ...bossspan.map((i) => i[1])
            )}
            <div class="row relative my-2 h-4 translate-x-10">
              <div
                style="left: {minspan}%"
                class:grayscale={mon.status === 5}
                class="absolute -top-5 z-40 -ml-2 -translate-x-1/2 scale-75"
              >
                <PIcon name={key} />
              </div>

              {#if mon.status === 5}
                <div
                  style="right: calc({100 - maxspan}% - 28px)"
                  class="absolute -top-1.5 z-40 z-[400] -translate-x-1/2 scale-75 rounded-full border-2 border-gray-900 border-transparent bg-gray-900 p-1 text-white dark:bg-gray-100 dark:text-gray-900"
                >
                  <Icon icon={Deceased} />
                </div>
              {/if}

              {#each routes
                .map((r, i) => ({ ...r, index: i }))
                .filter((r, i) => r.type === 'gym' && i < maxgantt && teams.findIndex((t) => t.id === r.value) > -1) as r}
                {@const left = (r.index / maxgantt) * 95}

                {#if teamMap[r.value]?.findIndex((t) => t.id === locid(mon)) > -1}
                  <div
                    style="left: {left}%"
                    class="absolute z-[200] h-4 w-4 -translate-y-[4px] -translate-x-1/2 scale-75"
                  >
                    <PIcon type="b" name={league?.[r.value]?.speciality} />
                  </div>
                {/if}

                {#if i === 0}
                  <div
                    style="left: {left}%"
                    class="leader absolute -top-10 z-40 h-8 w-8 -translate-x-1/2 overflow-hidden rounded-full border border-gray-200 bg-white dark:border-gray-900 dark:bg-gray-700"
                  >
                    <img
                      class="translate-y-2 scale-[1.75]"
                      width={96}
                      src={IMG + league?.[r.value]?.img + '.png'}
                    />
                  </div>
                  <div
                    style="left: {left}%; top: -200px;"
                    class="absolute z-10 h-px w-[1200px] origin-left rotate-90 bg-gray-200 dark:bg-gray-900"
                  />
                {/if}
              {/each}

              <div
                style="left: calc({minspan}% - 10px); right: calc({100 -
                  gotspan[1]}% - 10px)"
                class="absolute h-2 translate-y-1 rounded-lg bg-gray-200 dark:bg-gray-900"
              />

              {#each bossspan as span}
                <div
                  style="left: calc({span[0]}% - 10px); right: calc({100 -
                    span[1]}% - 10px)"
                  class="absolute z-20 h-full rounded-lg bg-cyan-400 dark:bg-sky-600"
                  class:dark:bg-teal-900={mon.status === 5}
                  class:dark:bg-teal-400={mon.status !== 5}
                />
              {/each}

              <!-- {#each points as p} -->
              <!--   {@const left = (p / routes.length) * 100} -->
              <!--   <div -->
              <!--     style="left: {left}%" -->
              <!--     class="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-orange-600" -->
              <!--   /> -->
              <!-- {/each} -->
            </div>
          {/each}
        </div>
      {/if}
    </Section>
  </main>
{/if}

<style>
  main {
    @apply grid grid-flow-dense gap-4;
  }

  main :global(.team) {
    grid-area: 1 / 1 / 3 / 4;
  }
  main :global(.badges) {
    grid-area: 1 / 4 / 2 / 6;
  }
  main :global(.bossfights) {
    grid-area: 2 / 4 / 6 / 6;
  }
  main :global(.box) {
    grid-area: 3 / 2 / 4 / 4;
  }
  main :global(.graveyard) {
    grid-area: 4 / 2 / 6 / 4;
  }
  main :global(.stats) {
    grid-area: 3 / 1 / 6 / 2;
  }

  main :global(.timeline) {
    grid-column: span 5;
  }

  img {
    image-rendering: pixelated;
  }
  section {
    @apply rounded-xl border border-gray-300 p-4;
  }

  .leader:hover {
    z-index: 200;
  }
</style>
