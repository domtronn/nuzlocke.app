<script>
  import LoaderPip from './LoaderPip.svelte'
</script>

<div class='h-screen flex items-center justify-center transform rotate-12 scale-150'>
  <div class='absolute flex items-center justify-center'>
    {#each Array(8).fill() as _, i}
      <LoaderPip delay={0.05 * i} />
    {/each}
  </div>
</div>
