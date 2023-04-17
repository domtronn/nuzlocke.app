<script>
  export let dmg,
    weakness,
    moves,
    pokemon = []

  const [team, opp] = pokemon

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Shield } from '$icons'

  import TypeLogo from '$lib/components/type-logo.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'

  const toGroups = (name) => {
    if (name.startsWith('urshifu')) debugger
    return Object.entries(weakness[name]).sort(([amod], [bmod]) => bmod - amod)
  }

  const toFraction = (s) => {
    if (s == 0.25) return '¼'
    if (s == 0.5) return '½'
    return s
  }
</script>

<!-- Maximum Dmg modifier for defending pokemon -->
<div
  style="transform: translateY(-5.5px)"
  class="relative w-1/2 text-center tracking-tighter md:mr-4 md:w-auto"
>
  <span class="text-tiny">Max dmg</span>
  <Icon
    inline={true}
    height="2.2rem"
    class="mx-auto fill-current"
    icon={Shield}
  />
  <span
    class="absolute top-8 -mt-2 -translate-x-1/2 cursor-help font-mono text-2xl"
  >
    <Tooltip>Based on {opp.name}'s moveset</Tooltip>

    {toFraction(dmg[team.alias][opp.alias] || 1)}x
  </span>
</div>

<!-- Phys vs Spec distribution -->
<div class="-mt-px w-1/2 text-tiny font-medium tracking-tighter md:w-auto">
  <span class="text-tiny font-normal">Dmg types</span>
  <div class="my-1 flex items-center gap-x-1">
    <TypeBadge type="physical" />
    {moves[opp.alias]?.physical || 0}%
  </div>
  <div class="flex items-center gap-x-1">
    <TypeBadge type="special" />
    {moves[opp.alias]?.special || 0}%
  </div>
</div>

<!-- Type weaknesses of attacking pokemon -->
<div class="mt-4.5 flex w-72 flex-wrap items-start md:ml-4 md:mt-px">
  <span class="w-full text-xs font-normal">
    {opp.name}'s weaknesses
  </span>

  {#each toGroups(opp.alias) as [mod, types], i}
    <div class="flex items-center font-mono text-xl leading-5">
      <span>{toFraction(mod)}x</span>
      <div class="ml-1 flex flex-wrap">
        {#each types as type}
          <TypeLogo class="origin-left scale-75" {type} />
        {/each}
      </div>
    </div>
  {/each}
</div>
