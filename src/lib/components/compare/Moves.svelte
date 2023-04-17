<script>
  export let calc,
    pokemon = []
  const [team, opp] = pokemon

  $: teamId = team.alias
  $: oppId = `${opp.alias}-${opp.id}`

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'
  import { CompareSummary } from './'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Info } from '$icons'

  const moves = (opp?.original?.moves || []).reduce(
    (acc, it) => ({ ...acc, [it.name]: it }),
    {}
  )
  const lvl = opp?.original?.level
</script>

<ul class="relative grid w-full grid-cols-4 text-sm md:mt-2 md:text-xs">
  <div
    class="absolute top-2 right-4 cursor-help text-lg text-gray-400 dark:text-gray-600 lg:top-0"
  >
    <Icon inline={true} icon={Info} class="fill-current" />
    <Tooltip>
      Damage calculations are estimates
      {#if lvl.startsWith('+') || lvl.startsWith('-')}
        with the team and relative levels being at Level 50
      {:else}
        with the team being at the Level Cap.
      {/if}
      with 0EVs and max IVs.
    </Tooltip>
  </div>

  <div class="col-span-4 flex items-center">
    <strong
      class="mr-2 hidden text-sm text-gray-600 dark:text-gray-50 lg:block"
    >
      Moves
    </strong>
    <CompareSummary pokemon={opp.original} />
  </div>

  {#each calc[teamId][oppId] as move (move)}
    <li
      class="col-span-2 my-2 -mt-1 flex flex-col leading-4 md:col-span-1 lg:w-24 lg:leading-3"
    >
      <div style="line-height:1.2em; min-height:2.4em;" class="flex items-end">
        <span class="relative" class:cursor-help={moves[move.name]?.effect}>
          {move.name}
          {#if moves[move.name]?.effect}
            <sup class="absolute top-1 -right-1">*</sup>
            <Tooltip>{moves[move.name]?.effect}</Tooltip>
          {/if}
        </span>
      </div>

      <p class="my-1 inline-flex origin-left scale-90 transform">
        <TypeBadge type={move.damage_class} />
        <TypeBadge type={move.type} className="ml-1" />
      </p>

      {#if move.desc}
        <p class="text-gray-500">
          <strong class="sm:-ml-2">~{Math.ceil(move.range[1] / 5) * 5}</strong>
          <span>dmg</span>
          <br class="hidden sm:block" />
          <small>({parseInt(move.desc.split(' - ')[1])}%)</small>
        </p>
      {/if}
    </li>
  {/each}
</ul>
