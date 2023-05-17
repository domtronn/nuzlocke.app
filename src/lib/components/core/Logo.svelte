<script>
  export let src,
    alt = '',
    aspect = '4x4',
    pixelated = false,
    role = '',
    loading = 'lazy',
    pictureClass = ''
  import { fade } from 'svelte/transition'

  const [width, height] = aspect.split('x')
</script>

<picture in:fade class={pictureClass || ''}>
  <source
    media="(min-width: 800px)"
    srcset="{src}@2.webp 1x"
    type="image/webp"
  />
  {#if loading === 'eager'}
    <source srcset="{src}@2.webp x2" type="image/webp" />
    <source srcset="{src}@1.webp x1" type="image/webp" />
  {:else}
    <source srcset="{src}@1.webp" type="image/webp" />
  {/if}

  <img
    class={$$restProps.class || ''}
    decoding="aysnc"
    class:pixelated
    src="{src}.png"
    {loading}
    {width}
    {height}
    {alt}
    {role}
    srcset="{src}@1.png 300w, {src}@2.png 600w"
    onerror="this.onerror = null; this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src"
  />
</picture>
n

<style lang="postcss">
  img.pixelated {
    image-rendering: pixelated;
  }
</style>
