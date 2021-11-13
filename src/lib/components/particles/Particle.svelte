<script>
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import Noise from 'simplex-noise'
  const simplex = new Noise()

  export let theta, v, decay = 0.975, g = 3, scale = 1
  const random = (Math.random() * 600) + 200
  let x = 0, y = 0, tiltTheta = 0


  onMount(() => {
    let frame
    function loop () {
      frame = requestAnimationFrame(loop)

      const tiltOffset = simplex.noise2D(x / random, y / random) * (Math.PI / 16)
      tiltTheta = tiltTheta + tiltOffset

      const xOffset = simplex.noise2D(x / random, y / random)
      x += (Math.cos(theta) * v) + xOffset
      y += Math.sin(theta) * v + g
      v *= decay
    }

    loop()
    return () => cancelAnimationFrame(frame)
  })
</script>

<span
  out:fade
  class='absolute flex items-center justify-center'
  style='left: {x}px; top: {y}px; transform: rotate({tiltTheta}rad) scale({scale});'
  >
  <slot />
</span>
