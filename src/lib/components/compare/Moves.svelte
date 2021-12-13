<script>
  export let calc, pokemon = []
  const [team, opp] = pokemon

  import TypeBadge from '$lib/components/type-badge.svelte'

</script>

<span class='text-sm -mb-1 md:hidden'>
  {opp.name}'s moveset
</span>

<ul class='grid grid-cols-2 w-full md:mt-2 text-sm md:text-xs'>
  {#each calc[team.sprite][opp.sprite] as move}
    <li class=my-2>
      <p class=mb-1>
        <strong>
          {move.name}
        </strong>

        {#if move.dmgrange}
          <span class='text-gray-500'>({move.dmgrange})</span>
        {/if}
      </p>

      <p class=inline-flex>
        <TypeBadge type={move.damage_class} />
        <TypeBadge type={move.type} className='ml-1' />
      </p>

    </li>
  {/each}
</ul>
