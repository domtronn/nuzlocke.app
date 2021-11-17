<script>
  export let src, alt = '', className = '', aspect = '4x4'
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
</script>

<picture in:fade>
  <source srcset='{src}.webp' type='image/webp' />
  <img class={className} src='{src}.png' {width} {height} {alt} />
</picture>
