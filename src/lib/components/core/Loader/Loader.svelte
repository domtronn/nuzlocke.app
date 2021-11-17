<script>
  import LoaderPip from './LoaderPip.svelte'
</script>

<div class='flex items-center justify-center transform rotate-12 scale-150'>
  <div class='absolute flex items-center justify-center -translate-y-full top-1/2'>
    {#each Array(8).fill() as _, i}
      <LoaderPip delay={0.05 * i} />
    {/each}
  </div>
</div>

<style>
  div { height: calc(100vh - 10rem); }
  div > div { height: auto; }
</style>
