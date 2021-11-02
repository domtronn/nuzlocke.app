<script>
  import { fade, slide } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
  import PokemonCard from '$lib/components/pokemon-card.svelte'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { activeGame, getGame, read } from '$lib/store'
  import { types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import Icon from 'svelte-icons-pack'
  import X from 'svelte-icons-pack/bi/BiX'

  let loading = true
  let ogbox = [], box = []
  activeGame.subscribe(gameId => {
    getGame(gameId).subscribe(read(data => {
      loading = false
      ogbox = box = Object
        .values(data)
        .filter(i => i.pokemon)
        .filter(({ status }) => status !== 5 && status !== 4)
    }))
  })

  let type = ''
  let stat = ''

  const clear = () => stat = type = ''
  $: filter = (p) => !type || Pokemon[p.pokemon].types.map(i => i.toLowerCase()).includes(type)

  const typeCounts = types
    .reduce((acc, it) => ({
      ...acc,
      [it]: ogbox.filter(p => (Pokemon[p.pokemon].types || []).map(i => i.toLowerCase()).includes(it)).length
    }), {})

  $: box = ogbox
    .sort((a, b) => {
      return stat
        ? Pokemon[b.pokemon].baseStats[stat] - Pokemon[a.pokemon].baseStats[stat]
        : a.id - b.id
    })

</script>

<div transition:fade class='container mx-auto'>
  <div class='flex justify-center'>
    <main role='main' class='w-full sm:w-2/3 md:w-3/4 grid grid-cols-3  md:grid-cols-8 gap-x-4 gap-y-4 md:gap-y-8 my-10 px-4 overflow-hidden'>

      <div class='grid grid-cols-5 gap-x-2 gap-y-2 col-span-3'>
        {#each types as t}
          {#if typeCounts[t] > 0}
            <label
              class='transition cursor-pointer'
              class:grayscale={type && type !== t}
              class:opacity-50={type && type !== t}
              class:grayscale-0={type && type === t}
            >
              <input type=radio bind:group={type} name='filter' value={t} />
              <TypeBadge type={t} className='w-full justify-center' />
            </label>
          {/if}
        {/each}
      </div>

      <div class='grid grid-cols-3 gap-2 col-span-2'>
        {#each stats as s}
          <label
            class='transition inline-flex text-center text-xs px-2 py-1 w-full text-gray-400 border-gray-300 font-medium border shadow-sm rounded-lg inline-flex'
            class:border-black={stat === s}
            class:text-black={stat === s}
            >
            <input type=radio bind:group={stat} name='sortable' value={s} />
            <Icon className='text-xxs {s !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-0.5 mr-1'  src={StatIconMap[s]} />
            {s}
          </label>
        {/each}
      </div>

      <div class='col-span-1 flex flex-col items-center justify-center'>
        <button on:click={clear} class='inline-flex items-center' >
          <Icon src={X} size='1.6em' />
          Clear filters
        </button>
      </div>

      <div class='col-span-2' />

      {#each box.filter(filter) as p (p.id)}
        <span
          animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
          out:fade={{ duration: 150 }}
          class='col-span-4 md:col-span-2 my-3'
          >
            <PokemonCard
              sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Pokemon[p.pokemon].num}.png`}
              maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
              moves={[]}
              name={p.nickname ? p.nickname : Pokemon[p.pokemon].name}
              stats={Pokemon[p.pokemon].baseStats}
              types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
              />
          </span>
      {/each}
    </main>
  </div>
</div>

<style>
  input { display: none; }
</style>
