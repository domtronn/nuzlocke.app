<script>
  export let className, width = '.2rem', border = 'black'
</script>

<div class='pixel-border {className} dark:shadow-lg' style='--pixel: {width}; --pixel-border: {border}; --pixel-border-3: {border};'>
  <slot />
</div>

<style lang="postcss">

  @media (min-width:theme('screens.sm')) {
    div {
      min-width: theme('maxWidth.lg');
    }
  }

  :root {
    --pixel-bg: theme('colors.gray.50');
    --pixel-border: black;
    --pixel-border-2: theme('colors.gray.200');
    --pixel-border-3: var(--pixel-border);

    --pixel-bg-dark: theme('colors.gray.900');
    --pixel-border-dark: theme('colors.gray.400');
    --pixel-border-2-dark: theme('colors.gray.900');
    --pixel-border-3-dark: var(--pixel-border-dark);
  }

  :global(.dark) .pixel-border {
    background: var(--pixel-bg-dark);

    box-shadow:

      /* Inner Background Color */
      0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg-dark),
      0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg-dark),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg-dark),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg-dark),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg-dark),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg-dark),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg-dark),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg-dark),

      /* Pixel Border Layer 1 */
      calc(var(--pixel) * -1) 0 0 0 var(--pixel-border-dark),
      var(--pixel) 0 0 0 var(--pixel-border-dark),
      0 calc(var(--pixel) * -2) 0 0 var(--pixel-border-dark),
      0 calc(var(--pixel) * 2) 0 0 var(--pixel-border-dark),
      0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-border-dark),
      0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-border-dark),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-border-dark),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-border-dark),
      0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-border-dark),
      0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-border-dark),
      0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-border-dark),
      0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-border-dark),

      /* Pixel Border Layer 2 */
      calc(var(--pixel) * -2) 0 0 0 var(--pixel-border-2-dark),
      calc(var(--pixel) * 2) 0 0 0 var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-border-2-dark),
      0 var(--pixel) 0 var(--pixel) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -4) 0 0 var(--pixel-border-2-dark),
      0 calc(var(--pixel) * 4) 0 0 var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-border-2-dark),
      0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-border-2-dark),

      /* Border Layer 3: --pixel-border-3 */
      calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3-dark),
      calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3-dark),
      0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3-dark),
      0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3-dark);
  }

  .pixel-border {
    background: var(--pixel-bg);
    box-shadow:

      /* Inner Background Color */
      0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg),

      /* Pixel Border Layer 1 */
      calc(var(--pixel) * -1) 0 0 0 var(--pixel-border),
      var(--pixel) 0 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * 2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-border),
      0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-border),

      /* Pixel Border Layer 2 */
      calc(var(--pixel) * -2) 0 0 0 var(--pixel-border-2),
      calc(var(--pixel) * 2) 0 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-border-2),
      0 var(--pixel) 0 var(--pixel) var(--pixel-border-2),
      0 calc(var(--pixel) * -4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * 4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
      0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),

      /* Border Layer 3: --pixel-border-3 */
      calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3),
      calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3),
      0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3),
      0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3),
      0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3);
  }

</style>
