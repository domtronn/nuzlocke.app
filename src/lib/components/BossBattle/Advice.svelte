<script>
  export let title,
    types = []

  import TypeLogo from '$c/type-logo.svelte'
</script>

{#if types && types.length > 0}
  <slot />
  <div>
    {#each types as type}
      <TypeLogo class="scale-75" {type} />
    {/each}
  </div>
{/if}

<style>
  div {
    direction: ltr;
    @apply mt-1 mr-8 grid grid-cols-6;
  }
</style>
