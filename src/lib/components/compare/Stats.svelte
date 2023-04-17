<script>
  export let pokemon = [],
    side

  import TypeBadge from '$lib/components/type-badge.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'

  const [atk, def] = pokemon
</script>

<SettingWrapper id="theme" let:setting={themeId}>
  <div class="w-1/2 flex-1 flex-grow">
    <span
      class="mb-2 ml-2 mr-2 flex gap-x-2 justify-{side === 'left'
        ? 'start'
        : 'end'}"
    >
      {#each atk.types as type}
        <TypeBadge type={type.toLowerCase()} />
      {/each}
    </span>

    <StatBlock
      class="grid-cols-11"
      nature={atk.nature}
      {...atk.baseStats}
      compare={def.baseStats}
      max={250}
      col={color(atk.types[0], themeId)}
      {side}
    />
  </div>
</SettingWrapper>
