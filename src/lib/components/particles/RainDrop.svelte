<script>
  import Particle from './Particle.svelte'
  export let y, initY, x, initX, height, width
  export let v, theta, scale, className

  $: if (y > height * 1.5) {
    y = initY
    x = initX
  }
  $: if (x < -width * 0.5 || x > width * 1.5) {
    x = initX
    y = initY
  }
</script>

<Particle bind:y bind:x g={1 + Math.random()} {v} {theta} {scale} {className}>
  <slot />
</Particle>
