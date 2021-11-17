<script>
  export let src, alt = '', className = '', aspect = '4x4'
  const [width, height] = aspect.split('x')
  console.log(src)
</script>

<picture>
  <source srcset='{src}.webp' type='image/webp' />
  <img class={className} src='{src}.png' {width} {height} {alt} />
</picture>
