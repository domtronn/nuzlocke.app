<script>
  export let title, className = ''

  import { onMount, setContext, getContext } from 'svelte'
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
        placement: 'left'
      })
    }
  }
</script>

<svelte:window on:click={reset} />

<button class='flex items-center dark:text-gray-600 dark:hover:text-gray-50 transition {className}'
        {title} bind:this={btnref} on:click|stopPropagation={toggle}>
  <slot />
</button>

<div bind:this={popoverref}>
  {#if $popover === id}
    <slot name=popover />
  {/if}
</div>

<style>
  div { z-index: 6666; }
</style>
