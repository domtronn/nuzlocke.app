<script>
  export let src, alt = '', className = '', aspect = '4x4', pixelated = false
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
</script>

<picture in:fade>
  <source srcset='{src}.webp' type='image/webp' />
  <img class={className} class:pixelated={pixelated} src='{src}.png' {width} {height} {alt} />
</picture>

<style>
  img.pixelated {
    image-rendering: pixelated;
  }
</style>
