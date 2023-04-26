<script>
  export let pokemon = [],
    side,
    hide = false

  import TypeBadge from '$lib/components/type-badge.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'

  const [atk, def] = pokemon
  const atkStats = atk?.original?.stats || atk.baseStats
  const defStats = def?.original?.stats || def.baseStats
</script>

<SettingWrapper id="theme" let:setting={themeId}>
  <div class="w-1/2 flex-1 flex-grow">
    <span
      class:sleft={side === 'left'}
      class:sright={side !== 'left'}
      class="absolute -top-1 z-50 mb-2 -mt-2 ml-3 mr-3 flex scale-75 gap-x-2"
    >
      {#each atk.types as type}
        <TypeBadge type={type.toLowerCase()} />
      {/each}
    </span>

    <StatBlock
      showbars={!hide}
      class="grid-cols-11"
      nature={atk.nature}
      {...atkStats}
      compare={defStats}
      max={250}
      col={color(atk.types[0], themeId)}
      {side}
    />
  </div>
</SettingWrapper>

<style>
  .sleft {
    left: 72px;
    @apply origin-left justify-start;
  }
  .sright {
    right: 72px;
    @apply origin-right justify-end;
  }

  @media (min-width: theme('screens.md')) {
    .sleft {
      left: 72px;
    }
    .sright {
      right: 72px;
    }
  }
</style>
