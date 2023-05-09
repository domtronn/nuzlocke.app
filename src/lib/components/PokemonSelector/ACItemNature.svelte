<script>
  import { Icon } from '$c/core'
  import { Chevron } from '$icons'

  export let item = {}
  const [pos, neg] = item?.value || []
</script>

<div
  class="-mx-1 flex inline-flex w-full items-center justify-between px-5 py-2 md:px-3 md:py-3"
>
  <span><slot /></span>
  {#if pos && neg}
    <div
      class="-my-4 -mr-3 flex items-end gap-x-2 text-tiny sm:flex-col sm:gap-x-0 sm:gap-y-1"
    >
      <span class="positive">
        {pos}
        <Icon inline icon={Chevron} class="fill-current" />
      </span>
      <span class="negative">
        {neg}
        <Icon inline icon={Chevron} class="rotate-180 fill-current" />
      </span>
    </div>
  {/if}
</div>

<style>
  span {
    @apply inline-flex items-center justify-end;
  }

  .positive {
    @apply text-orange-400;
  }
  .negative {
    @apply text-blue-600;
  }

  :global(.dark) .positive {
    @apply text-orange-400;
  }
  :global(.dark) .negative {
    @apply text-blue-400;
  }

  :global(.autocomplete-list-item.selected) .positive {
    @apply font-bold text-orange-300;
  }
  :global(.autocomplete-list-item.selected) .negative {
    @apply font-bold text-blue-300;
  }

  :global(.dark .autocomplete-list-item.selected) .positive {
    @apply font-bold text-orange-600;
  }
  :global(.dark .autocomplete-list-item.selected) .negative {
    @apply font-bold text-blue-600;
  }
</style>
