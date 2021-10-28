<script>
  import { slide } from 'svelte/transition'
  import Chevron from 'svelte-icons-pack/cg/CgChevronRightO'
  import Icon from 'svelte-icons-pack'

  export let entry

  let isOpen = false
  const toggle = _ => isOpen = !isOpen
</script>

<style>
  p { transition: transform 0.2s ease; }

  [aria-expanded=true] p { transform: rotate(0.25turn); }
</style>

<button
  on:click={toggle}
  aria-expanded={isOpen}
  class='inline-flex items-center'
>
  <p class='mr-4'>
    <Icon src={Chevron} size='2em' />
  </p>
  <slot name='heading' />
</button>

{#if isOpen}
<div transition:slide={{ duration: 300 }}>
  <slot name='item' />
</div>
{/if}
