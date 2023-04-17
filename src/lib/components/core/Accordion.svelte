<script>
  import { slide } from 'svelte/transition'
  import { Chevron } from '$icons'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  let isOpen = false
  const toggle = () => (isOpen = !isOpen)

  export let iconClassName = '',
    className = ''
</script>

<button
  aria-label="Open accordion"
  aria-expanded={isOpen}
  on:click={toggle}
  class="inline-flex w-full cursor-pointer items-center {className}"
>
  <span class="mr-2">
    {#if $$slots.icon}
      <slot
        name="icon"
        {isOpen}
        classes="text-base fill-current md:text-xl {iconClassName}"
      />
    {:else}
      <Icon
        inline={true}
        icon={Chevron}
        class="rotate-90 fill-current text-base md:text-xl {iconClassName}"
      />
    {/if}
  </span>
  <slot name="heading" />
</button>

{#if isOpen}
  <div in:slide={{ duration: 300 }}>
    <slot name="item" />
  </div>
{/if}

<style lang="postcss">
  button span {
    transition: transform 0.2s ease;
  }
  [aria-expanded='true'] span {
    transform: rotate(0.25turn);
  }
</style>
