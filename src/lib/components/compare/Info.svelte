<script>
  export let dmg, weakness, moves, pokemon = []

  const [team, opp] = pokemon

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Shield } from '$icons'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'

  const toGroups = (name) => Object
        .entries(weakness[name] || {})
        .sort(([amod], [bmod]) => bmod - amod)

  const toFraction = s => {
    if (s == 0.25) return '¼'
    if (s == 0.5) return '½'
    return s
  }
</script>

<!-- Maximum Dmg modifier for defending pokemon -->
<div
  style='transform: translateY(-5.5px)'
  class='relative text-center w-1/2 md:w-auto md:mr-4 tracking-tighter'
>
  <span class=text-tiny>Max dmg</span>
  <Icon inline={true} height=2.2rem class='fill-current mx-auto' icon={Shield} />
  <span class='cursor-help absolute text-2xl -mt-2 font-mono top-8 -translate-x-1/2'>
    <Tooltip> Based on {opp.name}'s moveset </Tooltip>

    {toFraction(dmg[team.sprite][opp.sprite] || 1)}x
  </span>
</div>

<!-- Phys vs Spec distribution -->
<div class='tracking-tighter w-1/2 md:w-auto text-tiny font-medium'>
  <span class='font-normal text-tiny'>Dmg types</span>
  <div class='flex gap-x-1 items-center my-1'>
    <TypeBadge type=physical />
    {moves[opp.sprite]?.physical || 0}%
  </div>
  <div class='flex gap-x-1 items-center'>
    <TypeBadge type=special />
    {moves[opp.sprite]?.special || 0}%
  </div>
</div>

<!-- Type weaknesses of attacking pokemon -->
<div class='tracking-tighter flex flex-col md:ml-4 mt-4 md:mt-0'>
  <span class='font-normal text-tiny'>
    {opp.name}'s weaknesses
  </span>
  {#each toGroups(opp.sprite) as [mod, types], i}
    <div class='flex items-center tracking-normal leading-5 text-xl font-mono'>
      <span>{toFraction(mod)}x</span>
      <div class='transform scale-75 origin-left ml-1 flex flex-wrap gap-1 lg:w-60'>
        {#each types as type}
          <TypeBadge {type} />
        {/each}
      </div>
    </div>
  {/each}
</div>
