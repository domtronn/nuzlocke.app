<script>
  export let pokemon = [], side

  import TypeBadge from '$lib/components/type-badge.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'
  import ColorMap from '$lib/data/colors.json'

  const [atk, def] = pokemon
  const col = ColorMap[atk.types[0].toLowerCase()]
</script>

<div class=flex-1>
  <span class='flex gap-x-2 mb-2 -ml-2 justify-{side === 'left' ? 'start' : 'end'} transform scale-75'>
    {#each atk.types as type}
      <TypeBadge type={type.toLowerCase()} />
    {/each}
  </span>

  <StatBlock
    nature={atk.nature}
    {...atk.baseStats}
    compare={def.baseStats}
    max={250}
    {col}
    {side}
  />
</div>
