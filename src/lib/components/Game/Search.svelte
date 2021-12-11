<script>
  import { fade } from 'svelte/transition'

  import Icon from 'svelte-icons-pack'
  import Search from 'svelte-icons-pack/bs/BsSearch'
  import X from 'svelte-icons-pack/bi/BiX'
  import Info from 'svelte-icons-pack/ri/RiSystemInformationLine'

  import { Tooltip, Input } from '$lib/components/core'

  export let term
  const clearterm = _ => term = ''
</script>

<Input
  rounded
  name=search
  placeholder=Search...
  bind:value={term}
  icon={Search}
>
  {#if term}
    <button
      transition:fade
      on:click={clearterm}
      title='Clear search'
      class='absolute right-0 top-0 bottom-0 px-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition z-index-50'
    >
      <Icon src={X} className='fill-current' size=1.4em/>
    </button>
  {/if}

  <div class='absolute right-0 translate-x-full top-1/2 -translate-y-1/2 hidden md:block cursor-help'>
    <Tooltip>
      Search and filter by Pokémon name, nickname, status or location name. e.g. Route 27, or captured
    </Tooltip>
    <Icon size=1.5em src={Info} className='m-2 fill-current' />
  </div>

</Input>
