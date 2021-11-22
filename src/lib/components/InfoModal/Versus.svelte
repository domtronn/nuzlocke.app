<script>
  export let atk, def
  import { PIcon } from '$lib/components/core'
</script>

<span class='inline-flex items-center'>
{#if atk}
  <PIcon className=-mx-2 name={atk} />
  <span class=mr-4>vs.</span>
{/if}
{#each def as name}
  <PIcon className=-mx-4 {name} />
{/each}
</span>
