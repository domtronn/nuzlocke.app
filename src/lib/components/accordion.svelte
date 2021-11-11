<script>
 import { slide } from 'svelte/transition'
 import Chevron from 'svelte-icons-pack/cg/CgChevronRightO'
 import Icon from 'svelte-icons-pack'

  let isOpen = false
  const toggle = _ => isOpen = !isOpen

  export let iconClassName = ''
</script>

<style>
 p { transition: transform 0.2s ease; }

 [aria-expanded=true] p { transform: rotate(0.25turn); }
</style>

<button
  aria-label='Open accordion'
  aria-expanded={isOpen}
  on:click={toggle}
  class='inline-flex items-center w-full cursor-pointer'
>
  <p class='mr-4'>
    <Icon src={Chevron} size='1.4em' className={iconClassName} />
  </p>
  <slot name='heading' />
</button>

{#if isOpen}
  <div transition:slide={{ duration: 300 }}>
    <slot name='item' />
  </div>
{/if}
