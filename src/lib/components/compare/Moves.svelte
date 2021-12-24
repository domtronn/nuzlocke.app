<script>
  export let calc, pokemon = []
  const [team, opp] = pokemon

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'
  import { CompareSummary } from './'

  import Icon from 'svelte-icons-pack'
  import Info from 'svelte-icons-pack/ri/RiSystemInformationLine'

  const moves = (opp?.original?.moves || []).reduce((acc, it) => ({ ...acc, [it.name]: it }), {})
</script>

<ul class='relative grid grid-cols-2 lg:grid-cols-4 w-full md:mt-2 text-sm md:text-xs'>
  <div class='absolute top-2 right-4 lg:top-0 text-gray-400 dark:text-gray-600 cursor-help text-lg'>
    <Icon src={Info} className=fill-current />
    <Tooltip>
      Damage calculations are estimates based on the team being at the Level Cap and having 0EVs and max IVs.
    </Tooltip>
  </div>


  <div class='flex items-center col-span-4'>
    <strong class='hidden text-gray-600 dark:text-gray-50 lg:block text-sm mr-2'>
    Moves
    </strong>
    <CompareSummary pokemon={opp.original} />
  </div>


  {#each calc[team.sprite][opp.sprite] as move}
    <li class='my-2 flex col-span-2 md:col-span-1 flex-col leading-4 lg:leading-3 lg:w-24 -mt-1'>
      <div
        style='line-height:1.2em; min-height:2.4em;'
        class='flex items-end tracking-tighter'
        >
        <span class:cursor-help={moves[move.name].effect}>
          {move.name}
          {#if moves[move.name].effect}
            *
            <Tooltip>{moves[move.name].effect}</Tooltip>
          {/if}
        </span>
      </div>

      <p class='inline-flex my-1 transform scale-90 origin-left'>
        <TypeBadge type={move.damage_class} />
        <TypeBadge type={move.type} className='ml-1' />
      </p>

      {#if move.desc}
        <p class=text-gray-500>
          <strong>~{Math.ceil(move.range[1] / 5) * 5}</strong>
          <span>dmg</span>
          <small>({parseInt(move.desc.split(' - ')[1])}%)</small>
        </p>
      {/if}

    </li>
  {/each}
</ul>
