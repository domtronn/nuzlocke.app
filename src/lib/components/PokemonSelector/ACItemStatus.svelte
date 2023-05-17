<script>
  import { Icon } from '$c/core'
  export let option, slot, iconClass, selected
</script>

{#if slot === 'option'}
  <div class="flex inline-flex items-center gap-x-2 px-3 py-2 md:py-3">
    <Icon inline icon={option.icon} class="fill-current md:scale-125" />
    <slot />
  </div>
{:else if slot === 'icon' && selected}
  <Icon
    inline
    class="absolute top-3 left-3 z-20 fill-current"
    icon={selected?.icon}
  />
{/if}
