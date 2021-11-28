<script>
  export let dmg, weakness, moves, pokemon = []

  const [team, opp] = pokemon

  import Icon from 'svelte-icons-pack'
  import Shield from 'svelte-icons-pack/bs/BsShield'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'

  const toGroups = (name) => Object
        .entries(weakness[name])
        .sort(([amod], [bmod]) => bmod - amod)

  const toFraction = s => {
    if (s == 0.25) return '¼'
    if (s == 0.5) return '½'
    return s
  }
</script>

<!-- Maximum Dmg modifier for defending pokemon -->
<div
  style='width: fit-content; transform: translateY(-5.5px)'
  class='relative align-top inline-block text-center mr-4 tracking-tighter'
>
  <span class=text-tiny>Max dmg</span>
  <Icon size=2.2rem className='-mt-1 fill-current mx-auto' src={Shield} />
  <span class='absolute text-2xl -mt-2 font-mono top-1/2 -translate-x-1/2'>
    <Tooltip> Based on {opp.name}'s moveset </Tooltip>

    {dmg[team.alias][opp.alias] || 1}x
  </span>
</div>

<!-- Phys vs Spec distribution -->
<div class='tracking-tighter inline-block align-top text-tiny font-medium'>
  <span class='font-normal text-tiny'>Dmg types</span>
  <div class='flex gap-x-1 items-center mb-1'>
    <TypeBadge type=physical />
    {moves[opp.alias]?.physical || 0}%
  </div>
  <div class='flex gap-x-1 items-center'>
    <TypeBadge type=special />
    {moves[opp.alias]?.special || 0}%
  </div>
</div>

<!-- Type weaknesses of attacking pokemon -->
<div class='tracking-tighter inline-block align-top ml-10 -mt-0.5'>
  {#each toGroups(opp.alias) as [mod, types]}
    <div class='transform scale-75 -translate-x-10 tracking-normal leading-5 text-xl font-mono'>
      <span>{toFraction(mod)}x</span>
      {#each types as type}
        <TypeBadge className='text-xs mr-1' {type} />
      {/each}
    </div>
  {/each}
</div>
