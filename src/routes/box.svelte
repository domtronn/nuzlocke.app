<script>
  import { browser } from '$app/env'
  import { onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import PokemonCard from '$lib/components/pokemon-card.svelte'

  import { Loader, IconButton } from '$lib/components/core'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import { activeGame, getGame, getBox, read } from '$lib/store'
  import { types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import Icon from 'svelte-icons-pack'
  import X from 'svelte-icons-pack/ri/RiSystemFilterOffFill'

  const { getPkmns } = getContext('game')

  onMount(() => {
    // FIXME: Awkward hack to allow page transition cleanup
    ['game_el', 'sidenav_el'].forEach(id =>{
      const el = document.getElementById(id)
      if (el) setTimeout(_ => el.remove(), 500)
    })
  })

  let loading = true
  let ogbox = [], box = [], Pokemon = {}
  getBox(b => {
    ogbox = box = b
    getPkmns(box.map(i => i.pokemon))
      .then(data => {
        Pokemon = data
        loading = false
      })
  })

  let type = ''
  let stat = ''

  const clear = () => stat = type = ''
  const sum = l => l.reduce((acc, it) => acc + it, 0)
  $: filter = (p) => !type || (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(type)
  $: typeCounts = types
    .reduce((acc, it) => ({
      ...acc,
      [it]: ogbox.filter(p => (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(it)).length
    }), {})

  $: box = ogbox
  .sort((a, b) => {
    if (stat === 'total') {
      return sum(Object.values(Pokemon[b.pokemon]?.baseStats))
        - sum(Object.values(Pokemon[a.pokemon]?.baseStats))
    }

    return stat
      ? Pokemon[b.pokemon]?.baseStats[stat] - Pokemon[a.pokemon]?.baseStats[stat]
      : a.id - b.id
    })

  $: enabled = box.length && (stat || type)
</script>

{#if loading}
  <Loader />
{:else}
  <div out:fade|local={{ duration: 250 }} in:fade|local={{ duration: 250, delay: 300 }} class='container mx-auto'>
    <div class='flex flex-col mx-auto items-center justify-center'>
      <main role='main' class='w-full sm:w-3/4 flex flex-col gap-y-4 py-6 pb-32 px-4 md:px-8 overflow-hidden'>

        <div class='inline-flex flex-wrap sm:flex-row gap-y-2 gap-x-4 sm:items-start z-50 mt-2'>
          <div class='grid sm:grid-rows-2 grid-cols-8 w-full sm:w-auto sm:grid-cols-5 gap-1 sm:gap-2 col-span-2'>
            <IconButton
              rounded
              src={X}
              track=clear-filters
              title='Clear filters'
              containerClassName='flex flex-col order-last sm:row-span-2 sm:order-none items-center justify-center'
              disabled={!enabled}
              on:click={clear}
            />

            {#each ['total'].concat(stats) as s}
              <label
                class='umami--click--sort-{s} transition items-center shadow-sm cursor-pointer inline-flex text-center row-span-1 text-xs px-2 py-1 w-full text-gray-500 dark:text-gray-400 border-gray-400 font-medium border shadow-sm rounded-lg justify-center md:justify-between'
                class:border-gray-600={stat === s}
                class:text-gray-50={stat === s}
                class:bg-gray-600={stat === s}
                class:dark:bg-gray-50={stat === s}
                class:dark:text-gray-900={stat === s}
                class:dark:border-gray-50={stat === s}
                >
                <input type=radio bind:group={stat} name='sortable' value={s} />
                {#if StatIconMap[s]}
                  <Icon className='hidden md:block text-tiny {s !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-2.5 mr-1'  src={StatIconMap[s]} />
                {:else}
                  <span />
                {/if}
                {s}
              </label>
            {/each}
          </div>

          <div class='w-full sm:w-auto grid grid-rows-3 grid-cols-5 md:grid-cols-9 gap-x-2 gap-y-2 col-span-3'>
            {#each types as t}
              {#if typeCounts[t] > 0}
                <label
                  class='transition cursor-pointer h-6 umami--click--filter-{t}'
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

          </div>
        </div>

        <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 :mt-6'>
          {#if box.length === 0}
            <span class='h-96 flex items-center justify-center col-span-4 dark:text-gray-600 text-xl'>You have no Pokémon in your box</span>
          {/if}
          {#each box.filter(filter) as p (p.id)}
            <span
              animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
              out:fade={{ duration: 150 }}
            >
              <PokemonCard
                sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Pokemon[p.pokemon].imgId}.png`}
                maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
                moves={[]}
                ability={p.nickname ? { name: p.nickname + ' the ' + (p.nature || '').toLowerCase() } : null}
                name={Pokemon[p.pokemon].name}
                stats={Pokemon[p.pokemon].baseStats}
                nature={p.nature}
                types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
              >
                <span class='text-xs text-center p-2 -mt-4 text-gray-500 z-40' slot="footer">
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
