<script>
  export let calc, pokemon = []
  const [team, opp] = pokemon

  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Tooltip } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Info from 'svelte-icons-pack/ri/RiSystemInformationLine'
</script>

<ul class='relative grid grid-cols-2 lg:grid-cols-3 w-full md:mt-2 text-sm md:text-xs'>

  <div class='absolute top-2 right-4 text-gray-400 dark:text-gray-600 cursor-help text-lg'>
    <Icon src={Info} className=fill-current />
    <Tooltip>
      Damage calculations are based on the team having 0EVs and max
      health all matching the max levelcap for the fight
    </Tooltip>
  </div>

  {#each calc[team.sprite][opp.sprite] as move}
    <li class='my-2 flex flex-col leading-4 lg:leading-3'>
      <strong>
        {move.name}
      </strong>

      <p class='inline-flex my-1'>
        <TypeBadge type={move.damage_class} />
        <TypeBadge type={move.type} className='ml-1' />
      </p>

      {#if move.desc}
        <p class=text-gray-500>
          <span>Dmg</span>
          <strong>{move.range[0]}</strong>
          to
          <strong>{move.range[1]}</strong>
        </p>
      {/if}

    </li>
  {/each}
</ul>
