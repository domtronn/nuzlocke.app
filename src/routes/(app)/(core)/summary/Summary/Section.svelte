<script>
  export let id
</script>

<section class={id}>
  <h2>
    <slot name="heading" />
  </h2>

  <div class={$$restProps.class || ''}>
    <slot />
  </div>
</section>

<style>
  section {
    @apply overflow-hidden rounded-xl border border-gray-300;
  }

  h2,
  div {
    @apply px-4 py-2;
  }

  h2 {
    @apply border-b border-gray-300 bg-gray-50 font-bold uppercase text-gray-800;
  }

  :global(.dark) section {
    @apply border-gray-900 bg-gray-700;
  }

  :global(.dark) h2 {
    @apply border-gray-900 bg-gray-900 text-gray-50;
  }
</style>
