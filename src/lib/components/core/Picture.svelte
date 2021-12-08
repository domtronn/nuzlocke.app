<script>
  export let src, alt = '', className = '', aspect = '4x4', pixelated = false
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
  let error = false, loading = true
  const onerror = _ => error = true
  const onload = _ => { error = false; loading = false }
</script>

<picture class:hidden={loading} in:fade>
  {#if !error}
    <source srcset='{src}.webp' type='image/webp' />
    <img
      on:error={onerror} on:load={onload}
      class={className} class:pixelated={pixelated} src='{src}.png' {width} {height} {alt} />
  {/if}
</picture>

<style>
  img.pixelated {
    image-rendering: pixelated;
  }
</style>
