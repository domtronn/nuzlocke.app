<script>
  import { browser } from '$app/env'
  import { fade, slide } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import PokemonCard from '$lib/components/pokemon-card.svelte'
  import Loader from '$lib/components/loader.svelte'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { activeGame, getGame, read } from '$lib/store'
  import { types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import Icon from 'svelte-icons-pack'
  import X from 'svelte-icons-pack/ri/RiSystemFilterOffFill'

  const fetchData = async (pkmn) => {
    if (!browser) return
    try {
      const res = await fetch(`/api/pokemon.json?p=${pkmn.join(',')}`)
      const data = await res.json()
      return data
    } catch (e) {
      console.error(e)
    }
  }

  let loading = true
  let ogbox = [], box = [], Pokemon = {}
  activeGame.subscribe(gameId => {
    if (browser && !gameId) return window.location = '/'

    getGame(gameId).subscribe(read(data => {
      ogbox = box = Object
        .values(data)
        .filter(i => i.pokemon)
        .filter(({ status }) => status !== 5 && status !== 4)

      fetchData(box.map(i => i.pokemon))
        .then(data => {
          Pokemon = data
          loading = false
        })
    }))
  })

  let type = ''
  let stat = ''

  const clear = () => stat = type = ''
  $: filter = (p) => !type || (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(type)
  $: typeCounts = types
    .reduce((acc, it) => ({
      ...acc,
      [it]: ogbox.filter(p => (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(it)).length
    }), {})

  $: box = ogbox
    .sort((a, b) => {
      return stat
        ? Pokemon[b.pokemon]?.baseStats[stat] - Pokemon[a.pokemon]?.baseStats[stat]
        : a.id - b.id
    })

  $: enabled = box.length && (stat || type)
</script>

{#if loading}
  <Loader />
{:else}
  <div out:fade={{ duration: 250 }} in:fade={{ duration: 250, delay: 300 }} class='container mx-auto'>
    <div class='flex flex-col mx-auto items-center justify-center'>
      <main role='main' class='w-full sm:w-2/3 md:w-3/4 flex flex-col gap-y-4 py-6 pb-32 px-4 md:px-8 overflow-hidden'>

        <div class='inline-flex flex-wrap sm:flex-row gap-y-2 gap-x-4 sm:items-start z-50 mt-2'>
          <div class='grid grid-cols-6 w-full sm:w-auto sm:grid-cols-3 gap-2 sm:gap-2 col-span-2'>
            {#each stats as s}
              <label
                class='transition shadow-md cursor-pointer inline-flex text-center text-xs px-2 py-1 w-full text-gray-500 border-gray-400 font-medium border shadow-sm rounded-lg justify-center md:justify-between'
                class:border-black={stat === s}
                class:text-black={stat === s}
                class:bg-gray-200={stat === s}
                class:dark:bg-gray-900={stat === s}
                class:dark:text-gray-200={stat === s}
                class:dark:border-gray-200={stat === s}
                >
                <input type=radio bind:group={stat} name='sortable' value={s} />
                <Icon className='hidden md:block text-tiny {s !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-0.5 mr-1'  src={StatIconMap[s]} />
                {s}
              </label>
            {/each}
          </div>

          <div class='w-full sm:w-auto grid grid-rows-3 grid-cols-5 md:grid-cols-9 gap-x-2 gap-y-2 col-span-3'>
            {#each types as t}
              {#if typeCounts[t] > 0}
                <label
                  class='transition cursor-pointer h-6'
                  class:grayscale={(type && type !== t) || !typeCounts[t]}
                  class:opacity-50={(type && type !== t) || !typeCounts[t]}
                  class:grayscale-0={type && type === t}
                >
                  <input disabled={!typeCounts[t]} type=radio bind:group={type} name='filter' value={t} />
                  <TypeBadge type={t} className='w-full justify-center' />
                </label>
              {/if}
            {/each}
          </div>

          <div class='sm:order-none w-full sm:w-auto order-first col-span-1 flex justify-end -mt-8 sm:mt-0'>
            <button
              class:focus:active:border-indigo-600={enabled}
              class:focus:active:bg-indigo-600={enabled}
              class:focus:active:text-white={enabled}
              class:hover:text-indigo-300={enabled}
              class:hover:border-indigo-200={enabled}

              class:dark:border-indigo-600={enabled}
              class:dark:bg-indigo-600={enabled}
              class:dark:text-gray-200={enabled}
              class:dark:hover:bg-indigo-400={enabled}
              class:dark:hover:text-indigo-600={enabled}
              disabled={!enabled}
              on:click={clear}
              class='inline-flex gap-x-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 disabled:opacity-25 w-full md:w-auto disabled:bg-gray-50 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 transition-colors text-gray-500 text-xs focus:outline-none leading-4  border-2 shadow-md block rounded-lg px-3 py-2'
            >
              <Icon src={X} className='fill-current' size='1.2em' />
              Clear filters
            </button>
          </div>
        </div>

        <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 mt-6'>
          {#if box.length === 0}
            <span class='h-96 flex items-center justify-center col-span-4 dark:text-gray-600 text-xl'>You have no Pokémon in your box</span>
          {/if}
          {#each box.filter(filter) as p (p.id)}
            <span
              animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
              out:fade={{ duration: 150 }}
              class='my-3'
              >
              <PokemonCard
                sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Pokemon[p.pokemon].imgId}.png`}
                maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
                moves={[]}
                ability={p.nickname ? { name: p.nickname + ' the' } : null}
                name={Pokemon[p.pokemon].name}
                stats={Pokemon[p.pokemon].baseStats}
                types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
              >
                <span class='text-xs text-center p-2 -mt-4 dark:text-gray-600 text-gray-400 z-40' slot="footer">
                  {#if p.location === 'Starter'}
                    Met in a fateful encounter
                  {:else}
                    Met {p.location.startsWith('Route') ? 'on' : 'in'} {p.location}
                  {/if}
                </span>
              </PokemonCard>
            </span>
          {/each}
        </div>
      </main>
    </div>
  </div>
{/if}

<style>
  input { display: none; }
</style>
