<script>
  import { Icon } from '$c/core'
  export let icon,
    el = 'button'
</script>

<li>
  <svelte:element
    this={el}
    on:click
    class="inline-flex w-full items-center py-2 pl-4 text-left text-sm hover:bg-orange-500 hover:text-white"
  >
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <Icon inline {icon} class="mr-2 inline fill-current" />
    {/if}
    <slot />
  </svelte:element>
</li>
