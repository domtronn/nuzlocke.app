<script>
  export let name, priority, power, type, damage_class, effect, stab
  import { capitalise } from '$lib/utils/string'

  import { Tooltip, Icon } from '$c/core/'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import { Sword, Boost } from '$icons'
  import { Asterisk as Info } from '$icons'
  import { Chevron as Priority, DoubleChevron as HighPriority } from '$icons'

</script>

<div class='my-2'>
  <p class='text-sm overflow-ellipsis mb-1 relative items-center flex flex-row space-x-1'>
    <span class='w-auto relative {effect ? 'mr-2 cursor-help' : ''}'>

      {#if effect}
        <Tooltip>{effect}</Tooltip>
        <Icon
          inline={true}
          height='0.8em'
          icon={Info}
          class='fill-current absolute right-0 top-1 -translate-y-1/2 translate-x-full'
          />
      {/if}


      <span class='font-medium'>
        {capitalise(name)}
      </span>
    </span>

    {#if power}
      <span class='font-bold text-sm inline-flex relative items-center'>
        <!-- Icon -->
        <span class='relative'>
          <Icon inline icon={Sword} class='text-xs fill-current' />
        </span>

        <!-- Desktop power -->
        <span class='w-0 invisible sm:w-auto sm:visible relative'>
          {#if stab}
            <Tooltip>Base power {power}</Tooltip>
            <Icon inline icon={Boost} class='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current' />
            <span class='font-bold cursor-help'>
              {Math.round(power * 1.5)}
            </span>
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
          <Icon inline icon={HighPriority} class='fill-current -mr-1.5' />
          <Icon inline icon={HighPriority} class='fill-current' />
        {:else if priority > 2}
          <Icon inline icon={HighPriority} class='-mr-1.5 fill-current' />
          <Icon inline icon={Priority} class='fill-current' />
        {:else if priority > 1}
          <Icon inline icon={HighPriority} class='fill-current' />
        {:else}
          <Icon inline icon={Priority} class='fill-current' />
        {/if}
      </span>
    {/if}
  </div>
</div>
