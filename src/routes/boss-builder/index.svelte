<script>
  let value = `--1|Fireman Sam|fire
torkoal|23|explosion,sunny-day,solar-beam,recover|drought|fire-gem
arcanine|22|fire-spin,extreme-speed,quick-attack|intimidate|sitrus-berry

--2|
`

  import PokemonData from 'pokemon-assets/assets/data/pokemon.json'
  import _MovesData from 'pokemon-assets/assets/data/moves.json'
  import _AbilityData from 'pokemon-assets/assets/data/abilities.json'
  import _ItemData from 'pokemon-assets/assets/data/items.json'

  const AbilityData = Object.values(_AbilityData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
  const MovesData = Object.values(_MovesData).reduce((ac, it) => ({ ...ac, [it.slug]: it }), {})
  const ItemData = Object.values(_ItemData).reduce((ac, it) => ({ ...ac, [it.sprite]: it }), {})

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'

  const fauxfetch = p => {
    const fullP = PokemonData[p.name]
    const fullMoves = (p?.moves || []).map(m => {
      const data = MovesData[m]
      if (!data) return
      return {
        name: data.name,
        damage_class: data.category.toLowerCase(),
        power: data.basePower,
        priority: data.priority,
        type: data.type.toLowerCase()
      }
    })
    const fullAbility = AbilityData[p.ability]
    const fullItem = ItemData[p.held]

    console.log(fullMoves)

    if (!fullP) return

    return {
      ...fullP,
      ...p,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fullP.num}.png`,
      held: fullItem ? { name: fullItem.name, effect: '...', sprite: fullItem.sprite } : '',
      ability: fullAbility ? { name: fullAbility.name } : '',
      stats: fullP.baseStats,
      types: fullP.types.map(i => i.toLowerCase()),
      maxStat: Math.max(...Object.values(fullP.baseStats)),
      moves: fullMoves.filter(i => !!i)
    }
  }

  const nonnull = (o = {}) => Object.fromEntries(Object.entries(o).filter(([, val]) => !!val))
  const parseleader = l => {
    const [id, name, speciality, img] = l.replace(/#.*$/g, '').slice(2).trim().split('|')
    return [id, { [id]: nonnull({ name, speciality, img, pokemon: [] })}]
  }

  const parsepokemon = l => {
    const [name, level, moves = '', ability, held, starter] = l.split('|')
    return nonnull({ name, level, moves: moves.split(',').filter(i => i.length), ability, held, starter })
  }

  const parse = data => {
    if (!data) return {}

    let currScope

    return data
    .split('\n')
    .reduce((acc, it) => {
      if (!it.trim().length || it.startsWith('#')) return acc // ignore blank lines and comments
      if (it.startsWith('--')) {
        const [id, data] = parseleader(it)
        currScope = id
        return { ...acc, ...data }
      }

      if (!acc[currScope]) return acc

      return {
        ...acc,
        [currScope]: {
          ...acc[currScope],
          pokemon: acc[currScope]?.pokemon.concat(
            parsepokemon(it)
          )
        }
      }

    }, {})
  }

  let parsed = {}
  $: value, parsed = parse(value)
</script>

<svelte:head>
  <link rel=stylesheet href=/assets/items.css />
</svelte:head>

<div class='flex flex-col px-12'>
  <h2>Boss builder</h2>

  <div class='w-full flex'>
    <div class='flex flex-col w-1/3 py-4 pr-12'>
      <textarea bind:value />
    </div>

    <div class='w-2/3 py-4 overflow-y-scroll'>
      <div class='grid grid-cols-2 gap-x-4 gap-y-8'>
        {#each Object.values(parsed) as boss (boss)}
          <div class='flex w-full gap-x-4 justify-between col-span-2'>
            <div class='flex items-center'>
            <h2 class='text-2xl font-bold mr-2'>{boss?.name || ''}</h2>
            {#if boss.speciality}
              <TypeBadge type={boss.speciality} />
            {/if}
            </div>
            {#if boss.pokemon.length && boss.pokemon.some(i => +i.level >0)}
              <Label heading='Lvl cap' body={Math.max(... boss.pokemon.map(i => i.level || 0))} />
            {/if}
          </div>
            {#each boss.pokemon as pokemon}
              {#if fauxfetch(pokemon)}
                <Pokemon {...fauxfetch(pokemon)} />
              {/if}
            {/each}
          {/each}
        </div>
    </div>
  </div>

</div>

<style>
  textarea {
    @apply w-full h-96 rounded-lg p-4 text-gray-900 text-xs bg-gray-50 shadow-lg;
    resize: none;
  }
</style>
