<script>
  export let src, alt = '', className = '', aspect = '4x4', pixelated = false, role = '', fadeIn = true, loading = 'lazy'
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
</script>

{#if fadeIn}
<picture class={$$restProps.class || ''} in:fade>
  <source onError="this.onerror = null; this.style.display = 'none'" srcset='{src}.webp' type='image/webp' />
  <img class='{className}' class:pixelated={pixelated} src='{src}.png' {loading} {width} {height} {alt} {role} onerror='this.onerror = null; this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src'/>
</picture>
{:else}
<picture class={$$restProps.class || ''}>
  <source onError="this.onerror = null; this.style.display = 'none'" srcset='{src}.webp' type='image/webp' />
  <img class='{className}' class:pixelated={pixelated} src='{src}.png' {loading} {width} {height} {alt} {role} onerror='this.onerror = null; this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src'/>
</picture>
{/if}

<style lang="postcss">
  img.pixelated {
    image-rendering: pixelated;
  }
</style>
