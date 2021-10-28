<script>
  export let name, accuracy, priority, power, type, damage_class, effect, stab
  import { capitalise } from '$lib/utils/string'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import Icon from 'svelte-icons-pack'

  import Sword from 'svelte-icons-pack/ri/RiOthersSwordFill'
  import Chevron from 'svelte-icons-pack/Io/IoChevronUpOutline'
  import Info from 'svelte-icons-pack/ri/RiEditorAsterisk'
  import Priority from 'svelte-icons-pack/bi/BiSolidChevronUp'
  import HighPriority from 'svelte-icons-pack/bi/BiSolidChevronsUp'

</script>

<div class='my-2'>
  <p class='text-sm mb-1 relative items-center flex space-x-1'>
    <span
      class='w-auto bg-red relative {effect ? 'mr-2' : ''}'
      data-tooltip={effect || null}>

      {#if effect}
        <Icon
          size='0.5em'
          src={Info}
          className='fill-current absolute right-0 top-1 -translate-y-1/2 translate-x-full'
          />
      {/if}

      <span class='font-medium'>{capitalise(name)}</span>
    </span>

    {#if power}
      <span class='font-bold text-sm inline-flex items-center'>
        <span class='relative'>
          <Icon src={Sword} className='text-xs fill-current' />
        </span>
        <span class='relative'>
          {#if stab}
            <Icon src={Chevron} className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current' />
          {Math.round(power * 1.5)}
        {:else}
          {power}
        {/if}
        </span>
      </span>
    {/if}

    <span class='flex flex-row'>
    {#if priority > 3}
      <Icon src={HighPriority} className='-mr-1.5' />
      <Icon src={HighPriority} />
    {:else if priority > 2}
      <Icon src={HighPriority} className='-mr-1.5' />
      <Icon src={Priority} />
    {:else if priority > 1}
      <Icon src={HighPriority} />
    {:else if priority > 0}
      <Icon src={Priority} />
    {/if}
    </span>

  </p>

  <div class='flex gap-x-1 justify-start items-center'>
    <TypeBadge type={damage_class} />
    <TypeBadge type={type} />
  </div>
</div>
