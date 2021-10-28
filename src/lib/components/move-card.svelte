<script>
  export let name, accuracy, priority, power, type, damage_class, effect
  import { capitalise } from '$lib/utils/string'
  import TypeBadge from '$lib/components/type-badge.svelte'

  import Icon from 'svelte-icons-pack'

  import Sword from 'svelte-icons-pack/ri/RiOthersSwordFill'
  import Info from 'svelte-icons-pack/ri/RiEditorAsterisk'
  import Priority from 'svelte-icons-pack/fi/FiChevronUp'
  import HighPriority from 'svelte-icons-pack/fi/FiChevronsUp'

</script>

<div class='my-2'>

  <p class='text-sm mb-1 relative items-center flex divide-x divide-black'>
    <span
      class='w-auto bg-red relative'
      data-tooltip={effect || null}>

      {#if effect}
        <Icon
          size='0.5em'
          src={Info}
          className='fill-current absolute top-0 left-0 -translate-x-full'
          />
      {/if}

    <span>{capitalise(name)}</span>
    </span>

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

      {#if power}
        <span class='font-bold text-xs inline-flex items-center text-gray-800'>
          <Icon src={Sword} className='fill-current' />
          {power}
        </span>
      {/if}
    </p>

  <div class='flex gap-x-1 justify-start items-center'>
    <TypeBadge type={damage_class} />
    <TypeBadge type={type} />
  </div>
</div>
