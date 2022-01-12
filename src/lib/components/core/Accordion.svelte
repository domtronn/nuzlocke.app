<script>
  import { slide } from 'svelte/transition'
  import Chevron from 'svelte-icons-pack/bi/BiSolidChevronRight'
  import Icon from 'svelte-icons-pack'

  let isOpen = false
  const toggle = () => isOpen = !isOpen

  export let iconClassName = '', className = ''
</script>

<style>
 button span { transition: transform 0.2s ease; }
 [aria-expanded=true] span { transform: rotate(0.25turn); }
</style>

<button
  aria-label='Open accordion'
  aria-expanded={isOpen}
  on:click={toggle}
  class='inline-flex items-center w-full cursor-pointer {className}'
>
  <span class='mr-2'>
    {#if $$slots.icon}
      <slot name='icon' {isOpen} classes='text-base fill-current md:text-xl {iconClassName}' />
    {:else}
      <Icon src={Chevron} className='text-base fill-current md:text-xl {iconClassName}' />
    {/if}
  </span>
  <slot name='heading' />
</button>

{#if isOpen}
  <div transition:slide={{ duration: 300 }}>
    <slot name='item' />
  </div>
{/if}
