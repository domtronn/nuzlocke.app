<script>
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  import SearchBar from './SearchBar.svelte'

  import { Icon, IconButton, Tooltip } from '$c/core'
  import { Info, Search, X } from '$icons'

  export let term
  const dispatch = createEventDispatcher()

  let open = false, inputRef
  function handleOpen () {
    if (open) term = ''
    open = !open
  }

  $: term, dispatch('search', { search: term })
</script>

<span class='hidden md:block'>
  <SearchBar bind:term>
    <div class='absolute right-0 translate-x-full top-1/2 -translate-y-1/2 hidden md:block cursor-help text-gray-400 dark:text-gray-600'>
      <Tooltip>
        Search and filter by Pokémon name, nickname, status, location name or encounter table. e.g. Route 27, or captured
      </Tooltip>
      <Icon inline={true} height=1.5em icon={Info} class='m-2 fill-current' />
    </div>
  </SearchBar>
</span>

<div
  in:fade
  class:bg-gray-50={open}
  class:dark:bg-gray-800={open}
  class:pl-4={open}
  class:left-0={open}
  class:transition={open}
  class='block md:hidden safe-bottom fixed -bottom-2 duration-500 right-0 pb-8 pt-2 pr-4 text-left pointer-events-none'>
  {#if open}
    <div
      class='absolute w-4/5 pointer-events-auto'
      bind:this={inputRef}
      in:fly={{ x: -450, duration: 350 }}
    >
      <SearchBar bind:term />
    </div>
  {/if}

<IconButton
  on:click={handleOpen}
  title='{open ? 'Close' : 'Open'} search bar'
  containerClassName='float-right rounded-full searchbutton transform -translate-y-8 -translate-x-1 pointer-events-auto'
  src={open ? X : Search}
  />
</div>

<style>
  :global(.dark .searchbutton) {
    @apply !border-gray-900;

  }
  :global(.searchbutton) {
    @apply !border-gray-200;
  }

</style>
