<script>
  import { slide } from 'svelte/transition'
  import { Chevron } from '$icons'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  let isOpen = false
  const toggle = () => (isOpen = !isOpen)

  export let jsenabled = true,
    iconClassName = '',
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

{#if !jsenabled || isOpen}
  <div
    class:hidden={!isOpen}
    in:slide={{ duration: 300 }}
    >
    <slot name="item" />
  </div>
{/if}

<style lang="postcss">
  [aria-expanded='true'] span {
    transition: transform 0.2s ease;
    transform: rotate(0.25turn);
  }
</style>
