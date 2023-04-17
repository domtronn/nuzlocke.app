<script>
  export let title,
    types = []

  import TypeLogo from '$c/type-logo.svelte'
</script>

{#if types && types.length > 0}
  <p>
    <slot />
  </p>
  <div>
    {#each types as type}
      <TypeLogo class="scale-65 md:scale-75" {type} />
    {/each}
  </div>
{/if}

<style>
  div {
    direction: ltr;
    @apply mx-auto mt-1 flex grid-cols-6 justify-center md:mr-8 md:ml-2 md:grid;
  }

  p {
    @apply pr-4 text-center text-xs italic text-gray-500 md:ml-2 md:text-left;
  }
</style>
