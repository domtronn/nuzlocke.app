<script>
  export let pokemon = []

  import { browser } from '$app/env'

  import { getContext } from 'svelte'
  import { capitalise } from '$lib/utils/string'
  import { activeGame, getGame, read } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import ColorMap from '$lib/data/colors.json'

  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiSolidRightArrow'

  import CompareCard from './CompareCard.svelte'
  import CompareControls from './CompareControls.svelte'
  import { PIcon } from '$lib/components/core'

  const { getPkmn, getPkmns } = getContext('game')

  $: box = []
  $: gym = []

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

  let i = 0, j = 0
  $: i = 0, j = 0
  $: compare = [box[i], gym[j]]

  const select = p => p?.sprite
</script>

<section class=pb-4>
  {#if box.length && gym.length}
    <CompareCard className=mt-12 pokemon={compare} />
    <div class='flex rounded-xl py-2 flex-col gap-y-4 sm:gap-y-0 sm:gap-x-2 mt-2 sm:mt-0'>
      <CompareControls title='Your team' className=flex-1 bind:value={i} list={box} {select} />
      <CompareControls title='Gym team' className=flex-1 bind:value={j} list={gym} {select} />
    </div>
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
