<script>
  export let pokemon = [], side

  import TypeBadge from '$lib/components/type-badge.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'

  const [atk, def] = pokemon
</script>

<SettingWrapper id=theme let:setting={themeId}>
  <div class=flex-1>
    <span class='flex gap-x-2 mb-2 -ml-2 justify-{side === 'left' ? 'start' : 'end'} transform scale-75'>
      {#each atk.types as type}
        <TypeBadge type={type.toLowerCase()} />
      {/each}
    </span>

    <StatBlock
      class=grid-cols-11
      nature={atk.nature}
      {...atk.baseStats}
      compare={def.baseStats}
      max={250}
      col={color(atk.types[0])}
      {side}
      />
  </div>
</SettingWrapper>
