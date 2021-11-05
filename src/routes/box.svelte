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
  import X from 'svelte-icons-pack/bi/BiX'

  const fetchData = async (pkmn) => {
    if (!browser) return
    try {
      const res = await fetch(`/pokemon.json?p=${pkmn.join(',')}`)
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

</script>

{#if loading}
  <Loader />
{:else}
  <div transition:fade class='container mx-auto'>
    <div class='flex flex-col mx-auto items-center justify-center'>
      <main role='main' class='w-full sm:w-2/3 md:w-3/4 flex flex-col gap-y-4 py-6 px-4 md:px-8 overflow-hidden'>

        <div class='inline-flex flex-wrap flex-col sm:flex-row gap-y-2 gap-x-4 sm:items-start z-50'>
          <div class='grid grid-cols-6 w-full sm:w-auto sm:grid-cols-3 gap-2 sm:gap-2 col-span-2'>
            {#each stats as s}
              <label
                class='transition cursor-pointer inline-flex text-center text-xs px-2 py-1 w-full text-gray-500 border-gray-400 font-medium border shadow-sm rounded-lg inline-flex'
                class:border-black={stat === s}
                class:text-black={stat === s}
                class:bg-gray-200={stat === s}
                >
                <input type=radio bind:group={stat} name='sortable' value={s} />
                <Icon className='text-xxs {s !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-0.5 mr-1'  src={StatIconMap[s]} />
                {s}
              </label>
            {/each}
          </div>

          <div class='grid grid-cols-5 sm:grid-cols-9 gap-x-2 gap-y-2 col-span-3'>
            {#each types as t}
              {#if typeCounts[t] > 0}
                <label
                  class='transition cursor-pointer'
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

          <div class='sm:order-none order-first col-span-1 flex justify-end -mt-8 sm:mt-0'>
            <button on:click={clear} class='inline-flex items-center' >
              <Icon src={X} size='1.6em' />
              Clear filters
            </button>
          </div>
        </div>

        <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 mt-6'>
          {#each box.filter(filter) as p (p.id)}
            <span
              animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
              out:fade={{ duration: 150 }}
              class='my-3'
              >
              <PokemonCard
                sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Pokemon[p.pokemon].num}.png`}
                maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
                moves={[]}
                ability={p.nickname ? { name: p.nickname + ' the' } : null}
                name={Pokemon[p.pokemon].name}
                stats={Pokemon[p.pokemon].baseStats}
                types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
                />
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
