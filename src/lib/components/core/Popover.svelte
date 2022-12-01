<script>
  export let title, className = '', position = 'left'

  import { onMount } from 'svelte'
  import { popover } from '$lib/store'
  import { shortuuid } from '$lib/utils/uuid'

  const id = shortuuid()

  let create, loaded = false
  onMount(() => {
    import('@popperjs/core').then(m => {
      create = m.createPopper
      loaded = true
    })
  })

  let btnref, popoverref
  const reset = _ => $popover = null
  export const toggle = _ => {
    if ($popover === id) $popover = null
    else {
      $popover = id
      create(btnref, popoverref, {
        placement: position
      })
    }
  }
</script>

<svelte:window on:click={reset} />

<button class='flex items-center text-gray-300 hover:text-gray-800 dark:text-gray-600 dark:hover:text-gray-50 transition {className}'
        {title} bind:this={btnref} on:click|stopPropagation={toggle}>
  <slot />
</button>

<div bind:this={popoverref}>
  {#if $popover === id}
    <slot name=popover />
  {/if}
</div>

<style lang="postcss">
  div { z-index: 6666; }
</style>
