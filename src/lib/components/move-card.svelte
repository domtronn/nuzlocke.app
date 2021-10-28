<script>
  export let name, accuracy, priority, power, type, damage_class, effect
  import { capitalise } from '$lib/utils/string'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import Icon from 'svelte-icons-pack'

  import Info from 'svelte-icons-pack/ti/TiInfoLarge'
  import Priority from 'svelte-icons-pack/fi/FiChevronUp'
  import HighPriority from 'svelte-icons-pack/fi/FiChevronsUp'

</script>

<div class='my-2'>

  <p class='text-sm mb-1 relative items-center flex flex-row gap-x-1'>
{#if power}<span class='font-bold'>{power}</span>{/if}
  <span>{capitalise(name)}</span>
  {#if priority > 3}
    <Icon src={HighPriority} className='-mr-2.5' />
    <Icon src={HighPriority} />
  {:else if priority > 2}
    <Icon src={HighPriority} className='-mr-2.5' />
    <Icon src={Priority} />
  {:else if priority > 1}
    <Icon src={HighPriority} />
  {:else if priority > 0}
    <Icon src={Priority} />
  {/if}
</p>

  <div class='flex gap-x-1 justify-start items-center'>
    <TypeBadge type={damage_class} />
    <TypeBadge type={type} />
    {#if effect}
      <span data-tooltip={effect}>
        <Icon src={Info} className='hover:text-red-300 text-green-200' />
      </span>
    {/if}
  </div>
</div>
