<script>
  import { fade } from 'svelte/transition'
  
  import { Search, X, Info } from '$icons'
  import { Icon, Input } from '$c/core'

  export let term
  const clearterm = _ => term = ''
</script>

<Input
  rounded
  name=search
  class={$$restProps.class || ''}
  placeholder=Search...
  bind:value={term}
  icon={Search}
>
  {#if term}
    <button
      transition:fade
      on:click={clearterm}
      title='Clear search'
      class='absolute right-0 top-0 bottom-0 px-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition {$$restProps.class || ''}'
    >
      <Icon inline={true} icon={X} class='fill-current' height=1.4em/>
    </button>
  {/if}

  <slot />
</Input>
