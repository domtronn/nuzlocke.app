<script>
  export let name, priority, power, type, damage_class, effect, stab
  import { capitalise } from '$lib/utils/string'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import Icon from 'svelte-icons-pack'

  import Sword from 'svelte-icons-pack/ri/RiOthersSwordFill'
  import Chevron from 'svelte-icons-pack/io/IoChevronUpOutline'
  import Info from 'svelte-icons-pack/ri/RiEditorAsterisk'
  import Priority from 'svelte-icons-pack/bi/BiSolidChevronUp'
  import HighPriority from 'svelte-icons-pack/bi/BiSolidChevronsUp'

</script>

<div class='my-2'>
  <p class='text-sm overflow-ellipsis mb-1 relative items-center flex flex-row space-x-1'>
    <span
      class='w-auto relative {effect ? 'mr-2' : ''}'
      data-tooltip={effect || null}>

      {#if effect}
        <Icon
          size='0.5em'
          src={Info}
          className='fill-current absolute right-0 top-1 -translate-y-1/2 translate-x-full'
          />
      {/if}


      <span class='font-medium'>
        {capitalise(name)}
      </span>
    </span>

    {#if power}
      <span class='font-bold text-sm inline-flex items-center'>
        <!-- Icon -->
        <span class='relative'>
          <Icon src={Sword} className='text-xs fill-current' />
        </span>

        <!-- Desktop power -->
        <span
          data-tooltip={stab && power ? `Base power ${power}` : null}
          class='w-0 invisible sm:w-auto sm:visible relative'
        >
          {#if stab}
            <Icon src={Chevron} className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current' />
            <span class='font-bold'>{Math.round(power * 1.5)}</span>
          {:else}
            {power}
          {/if}
        </span>

        <!-- Mobile Power -->
        <span class='items-center font-bold inline-flex w-auto visible sm:hidden sm:w-0'>
          {power}
          {#if stab}
            <span class='ml-0.5 font-normal text-tiny text-gray-500'>+{Math.round(power * 0.5)}</span>
          {/if}
        </span>
      </span>
    {/if}

  </p>

  <div class='flex gap-x-1 justify-start items-center'>
    <TypeBadge type={damage_class} />
    <TypeBadge type={type} />
    <!-- Priority icons -->
    {#if priority > 0}
      <span class='flex flex-row dark:text-gray-200'>
        {#if priority > 3}
          <Icon src={HighPriority} className='fill-current -mr-1.5' />
          <Icon src={HighPriority} className='fill-current' />
        {:else if priority > 2}
          <Icon src={HighPriority} className='-mr-1.5 fill-current' />
          <Icon src={Priority} className='fill-current' />
        {:else if priority > 1}
          <Icon src={HighPriority} className='fill-current' />
        {:else}
          <Icon src={Priority} className='fill-current' />
        {/if}
      </span>
    {/if}
  </div>
</div>
