<script>
  export let pokemon = [], id = ''

  import { browser } from '$app/environment'

  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'

  import { capitalise } from '$lib/utils/string'
  import { activeGame, getGame, read } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import ColorMap from '$lib/data/colors.json'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Arrow } from '$icons'
  import { Plus } from '$icons'
  import { Minus } from '$icons'

  import { CompareStats, CompareCard, CompareControls, CompareInfo, CompareMoves } from './'
  import { Accordion, Tabs, PIcon } from '$lib/components/core'

  const { getPkmn, getPkmns } = getContext('game')

  $: box = []
  $: gym = []
  $: loading = true

  const fetchadvice = (team, box) =>
    fetch('/api/battle/advice.json', {
      method: 'POST',
      body: JSON.stringify({ team, box }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())

  activeGame.subscribe(gameId => {
    if (browser && !gameId) return

    getGame(gameId).subscribe(read(data => {
      // Fetch all gym pokemon from cache
      getPkmns(pokemon.map(p => p.name))
        .then(d => {
          gym = pokemon.map((it) => ({ original: it, ...d[it.name] }))
          j = Math.max(gym.findIndex(i => i.alias === id), 0)
        })

      // Fetch all box pokemon from cache
      Promise.all(
        Object
          .values(data)
          .filter(i => i.pokemon && NuzlockeGroups.Available.includes(i.status))
          .map(p => getPkmn(p.pokemon).then(d => ({ ...p, ...d })))
      ).then(d => {
        box = d.sort((a, b) => b.total - a.total)
        loading = false
      })
    }))
  })

  let i = 0, j = 0
  $: i = 0, j = 0
  $: compare = [{ ...box[i], id: i }, { ...gym[j], id: j }]

  let tab = 0
  $: tab = 0
  const select = p => p?.sprite
</script>

<section class=pb-4>
  {#if !loading && !box.length}
    <div class='bg-white px-6 py-8 text-center rounded-xl text-xl dark:bg-gray-900 dark:text-gray-50 shadow-lg'>
      <p class='mb-4'>You currently have no Pokémon to compare.</p>
      <p>Go back out there and Catch 'em All!</p>

    </div>
  {:else if box.length && gym.length}
    {#await fetchadvice(pokemon, box) then advice}
      <CompareCard className=mt-12 pokemon={compare}>

        <!-- Mobile display compare stats & info in tabs -->
        {#key compare}
        <div class:hidden={tab !== 0} class='md:flex relative flex flex-row gap-x-2 p-4 bg-white dark:text-gray-50 dark:bg-gray-900'>
          <CompareStats pokemon={compare} side=left />
          <CompareStats pokemon={[...compare].reverse()} side=right />
        </div>

        <div
          class='py-4 bg-white dark:bg-gray-900 flex flex-wrap md:border-t border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-200 pl-4 pr-2 pb-4 md:pl-8 md:pr-4 md:py-3'
          class:hidden={tab !== 1}>
          <CompareInfo {...advice} pokemon={compare} />
        </div>

        <div
          class='w-full py-4 bg-white dark:bg-gray-900 flex flex-wrap md:border-t border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-200 pl-4 pr-2 pb-4 md:pl-8 md:pr-4 md:py-3 rounded-b-lg'
          class:hidden={tab !== 2}>
          <CompareMoves calc={advice.calc} pokemon={compare} />
        </div>
        {/key}

        <Tabs
          bind:selected={tab}
          className='md:hidden w-full justify-end pr-5 dark:bg-gray-900 bg-white -my-1'
          name=page tabs={[ 'Stats', 'Info', 'Moves']}
        />

        <!-- Accordion info Desktop display -->
        <div class='bg-white dark:bg-gray-900 md:border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-200 pl-4 pr-2 pb-4 md:pl-8 md:pr-4 md:py-3 rounded-b-lg'>
          <Accordion className='hidden md:flex flex-row-reverse justify-between'>
            <strong slot=heading class=text-sm> Info </strong>
            <span slot=icon let:isOpen={isOpen} let:classes={className}>
              {#if isOpen}
                <Icon inline={true} height=0.8em icon={Minus} class='{className} transform -rotate-90' />
              {:else}
                <Icon inline={true} height=0.8em icon={Plus} class={className} />
              {/if}
            </span>

            <div slot=item class='text-gray-800 dark:text-gray-200'>
              {#key compare}
                <div class=inline-flex>
                  <CompareInfo {...advice} pokemon={compare} />
                </div>
                <CompareMoves {...advice} pokemon={compare} />
              {/key}
            </div>
          </Accordion>
        </div>

      </CompareCard>

      <div class='flex rounded-xl py-2 flex-col gap-y-4 sm:gap-y-0 sm:gap-x-2 mt-2 sm:mt-0'>
        <CompareControls title='Your team' className=flex-1 bind:value={i} list={box} {select} />
        <CompareControls title='Gym team' pageSize={6} controls={false} className=flex-1 bind:value={j} list={gym} {select} />
      </div>
    {/await}
  {/if}
</section>

<style>
  section { min-width: 100%; }

  @media (min-width:theme('screens.sm')) {
    section { min-width: 360px; }
  }
</style>
