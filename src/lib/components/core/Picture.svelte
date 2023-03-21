<script>
  export let src, alt = '', className = '', aspect = '4x4', pixelated = false, role = '', fadeIn = true
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
</script>

{#if fadeIn}
<picture in:fade>
  <source onError="this.onerror = null; this.style.display = 'none'" srcset='{src}.webp' type='image/webp' />
  <img class={className} class:pixelated={pixelated} src='{src}.png' {width} {height} {alt} {role} onerror='this.onerror = null; this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src'/>
</picture>
{:else}
<picture>
  <source onError="this.onerror = null; this.style.display = 'none'" srcset='{src}.webp' type='image/webp' />
  <img class={className} class:pixelated={pixelated} src='{src}.png' {width} {height} {alt} {role} onerror='this.onerror = null; this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src'/>
</picture>
{/if}

<style lang="postcss">
  img.pixelated {
    image-rendering: pixelated;
  }
</style>
