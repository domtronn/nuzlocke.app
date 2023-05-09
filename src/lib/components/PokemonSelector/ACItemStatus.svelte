<script>
  import { Icon } from '$c/core'
  export let item, slot, iconClass, selected
</script>

{#if slot === 'item'}
  <button class="flex inline-flex items-center gap-x-2 px-3 py-2 md:py-3">
    <Icon inline icon={item.icon} class="fill-current md:scale-125" />
    <slot />
  </button>
{:else if slot === 'icon' && selected}
  <Icon
    inline
    class="absolute top-3 left-3 z-20 fill-current"
    icon={selected?.icon}
  />
{/if}
