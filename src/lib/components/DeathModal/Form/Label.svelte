<script>
  export let optional
</script>

<p class='text-sm text-gray-700 dark:text-gray-300 {$$restProps.class || ''}'>
  <slot />
  {#if optional}
    <i class='dark:text-gray-600 text-gray-400'>- Optional</i>
  {/if}
</p>
