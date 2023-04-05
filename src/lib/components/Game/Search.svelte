<script>
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  import SearchBar from './SearchBar.svelte'

  import { Icon, IconButton, Tooltip } from '$c/core'
  import { Info, Search, X } from '$icons'

  export let term
  const dispatch = createEventDispatcher()

  let open = false, inputRef
  function handleOpen () { open = !open }

  $: inputRef?.querySelector('input')?.focus()
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
  class:bg-gray-800={open}
  class='block md:hidden transition safe-bottom fixed bottom-0 left-0 duration-500 right-0 p-4 text-left'>
  {#if open}
    <div
      class='absolute w-3/4'
      bind:this={inputRef}
      transition:fly={{ x: -450, duration: 350 }}
    >
      <SearchBar bind:term />
    </div>
  {/if}

{#if open}
  <IconButton
    on:click={handleOpen}
    title='Close search bar'
    containerClassName='float-right rounded-full'
    src={X}
    />
  {:else}
    <IconButton
      on:click={handleOpen}
      title='Open search bar'
      containerClassName='float-right rounded-full'
      src={Search}
      />
    {/if}
</div>
