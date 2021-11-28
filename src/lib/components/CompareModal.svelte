<script>
  export let pokemon = [], id = 0

  import { browser } from '$app/env'

  import { getContext } from 'svelte'
  import { capitalise } from '$lib/utils/string'
  import { activeGame, getGame, read } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import ColorMap from '$lib/data/colors.json'

  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiSolidRightArrow'
  import Plus from 'svelte-icons-pack/bi/BiPlus'
  import Minus from 'svelte-icons-pack/bi/BiMinus'

  import CompareCard from './CompareCard.svelte'
  import CompareControls from './CompareControls.svelte'
  import CompareInfo from './CompareInfo.svelte'

  import { Accordion, PIcon } from '$lib/components/core'

  const { getPkmn, getPkmns } = getContext('game')

  $: box = []
  $: gym = []

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
        .then(d => gym = Object.values(d))

      // Fetch all box pokemon from cache
      Promise.all(
        Object
          .values(data)
          .filter(i => NuzlockeGroups.Available.includes(i.status))
          .map(p => getPkmn(p.pokemon).then(d => ({ ...p, ...d })))
      ).then(d => box = d)
    }))
  })

  let i = 0, j = id
  $: i = 0, j = id
  $: compare = [box[i], gym[j]]

  const select = p => p?.sprite
</script>

<section class=pb-4>
  {#if box.length && gym.length}
    {#await fetchadvice(pokemon, box) then advice}
      <CompareCard className=mt-12 pokemon={compare}>

        <div class='bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-500 pl-4 pr-2 sm:pl-8 sm:pr-4 py-3 rounded-b-lg'>
          <Accordion className='flex-row-reverse justify-between'>
            <span slot=heading class=text-sm> Info </span>
            <span slot=icon let:isOpen={isOpen} let:className={className}>
              {#if isOpen}
                <Icon size=0.8em src={Minus} className='{className} transform -rotate-90' />
              {:else}
                <Icon size=0.8em src={Plus} {className} />
              {/if}
            </span>

            <div class=inline slot=item>
              {#key compare}
              <CompareInfo {...advice} pokemon={compare} />
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

  button {
    @apply flex bg-white z-50 my-6 px-5 rounded-full border-2 shadow-md flex flex-row items-center border-gray-600 text-gray-600 md:hover:border-indigo-600 md:hover:text-indigo-600 transition
  }

  :global(.dark) button {
    @apply bg-gray-800 border-2 border-gray-600 text-gray-600 md:hover:border-indigo-700 md:hover:text-indigo-800 md:hover:bg-gray-900;
  }

  @media (min-width:theme('screens.sm')) {
    section { min-width: 360px; }
  }

</style>
