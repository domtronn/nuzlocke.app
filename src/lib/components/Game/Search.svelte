<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Search } from '$icons'
  import { X } from '$icons'
  import { Info } from '$icons'

  import { Tooltip, Input } from '$lib/components/core'

  export let term
  const clearterm = _ => term = ''
  const dispatch = createEventDispatcher()

  $: term, dispatch('search', { search: term })

</script>

<Input
  rounded
  name=search
  className='important:pr sm:inverted'
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
      <Icon inline={true} icon={X} class='fill-current' height=1.4em/>
    </button>
  {/if}

  <div class='absolute right-0 translate-x-full top-1/2 -translate-y-1/2 hidden md:block cursor-help text-gray-400 dark:text-gray-600'>
    <Tooltip>
      Search and filter by Pokémon name, nickname, status, location name or encounter table. e.g. Route 27, or captured
    </Tooltip>
    <Icon inline={true} height=1.5em icon={Info} class='m-2 fill-current' />
  </div>

</Input>
