<script>
  import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
  import PokemonCard from '$lib/components/pokemon-card.svelte'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { getGame, read } from '$lib/store'
  import { types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import Icon from 'svelte-icons-pack'

  const game = getGame('nuzlocke')
  let ogbox = [], box = []
  game.subscribe(read(data => {
    ogbox = box = Object
      .values(data)
      .filter(i => i.pokemon)
      .filter(({ status }) => status !== 5 && status !== 4)
  }))

  const filterType = (type) => () => {
    box = ogbox.filter(p => (Pokemon[p.pokemon].types || []).map(i => i.toLowerCase()).includes(type))
  }

  const sortStat = (stat) => () => {
    box = box.sort((a, b) => Pokemon[b.pokemon].baseStats[stat] - Pokemon[a.pokemon].baseStats[stat])
  }

  const clear = () => { box = ogbox.sort((a, b) => a.id - b.id) }

  const typeCounts = types
    .reduce((acc, it) => ({
      ...acc,
      [it]: ogbox.filter(p => (Pokemon[p.pokemon].types || []).map(i => i.toLowerCase()).includes(it)).length
    }), {})

</script>

<div class='container mx-auto'>
  <div class='flex justify-center'>
    <main role='main' class='w-full sm:w-2/3 md:w-3/4 grid grid-cols-3  md:grid-cols-8 gap-x-4 gap-y-4 md:gap-y-8 my-10 px-4 overflow-hidden'>

      <div class='grid grid-cols-5 gap-x-2 gap-y-2 col-span-3'>
        {#each types as type}
          {#if typeCounts[type] > 0}
            <button on:click={filterType(type)} class='inline-flex'>
              <TypeBadge type={type} className='w-full justify-center' />
            </button>
          {/if}
        {/each}
      </div>

      <div class='grid grid-cols-3 gap-2 col-span-2'>
        {#each stats as stat}
          <button on:click={sortStat(stat)} class='inline-flex text-center'>
            <span class='text-xs px-2 py-1 w-full text-gray-400 border-gray-300 font-medium border shadow-sm rounded-lg inline-flex t'>
              <Icon className='text-xxs {stat !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-0.5 mr-1'  src={StatIconMap[stat]} />
              {stat}
            </span>
          </button>
        {/each}
      </div>

      <div class='col-span-1 flex flex-col items-center justify-center'>
        <button on:click={clear}>
          Clear filters
        </button>
      </div>

      <div class='col-span-2' />

      {#each box as p (p.id)}
        <span class='col-span-4 md:col-span-2 my-3'>
          <PokemonCard
            sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Pokemon[p.pokemon].num}.png`}
            maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
            moves={[]}
            name={p.nickname
            ? p.nickname
            : Pokemon[p.pokemon].name}
            stats={Pokemon[p.pokemon].baseStats}
            types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
            />
        </span>
      {/each}
    </main>
  </div>
</div>
