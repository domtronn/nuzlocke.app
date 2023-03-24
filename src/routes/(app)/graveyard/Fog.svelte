<script>
  import { fade } from 'svelte/transition'
  import { IMG } from '$utils/rewrites'
</script>

<div class='pointer-events-none fixed md:overflow-hidden inset-0 fog'>
  <div class='relative w-full h-full opacity-50'>
    <span in:fade={{ duration: 1800, delay: 550 }}>
      <div class='absolute top-0 bottom-0 animate flex overflow-hidden'>
        <picture class='h-full translate-y-1/3 w-1/2'>
          <source srcset="{IMG}/graves/fog@2.webp" media="(min-width: 620px)" type="image/webp" />
          <source srcset="{IMG}/graves/fog@1.webp" type="image/webp" />
          <img
            alt="Background fog to give aesthetic of graveyard"
            src="{IMG}/graves/fog@1.png"
            srcset="{IMG}/graves/fog@1.png 1x, {IMG}/graves/fog@2.png 2x"
            decoding=async loading=lazy
            />
        </picture>
        <picture class='h-full translate-y-1/3 w-1/2'>
          <source srcset="{IMG}/graves/fog@2.webp" media="(min-width: 620px)" type="image/webp" />
          <source srcset="{IMG}/graves/fog@1.webp" type="image/webp" />
          <img
            alt="Background fog to give aesthetic of graveyard"
            src="{IMG}/graves/fog@1.png"
            srcset="{IMG}/graves/fog@1.png 1x, {IMG}/graves/fog@2.png 2x"
            decoding=async loading=lazy
            />
        </picture>
      </div>
    </span>

    <span in:fade={{ duration: 2250, delay: 200 }}>
      <div class='absolute top-0 bottom-0 animate-slow flex overflow-hidden'>
        <picture class='h-full rotate-180 -translate-y-1/3 w-1/2'>
          <source srcset="{IMG}/graves/fog@2.webp" media="(min-width: 620px)" type="image/webp" />
          <source srcset="{IMG}/graves/fog@1.webp" type="image/webp" />
          <img
            alt="Background fog to give aesthetic of graveyard"
            src="{IMG}/graves/fog@1.png"
            srcset="{IMG}/graves/fog@1.png 1x, {IMG}/graves/fog@2.png 2x"
            decoding=async loading=lazy
            />
        </picture>
        <picture class='h-full rotate-180 -translate-y-1/3 w-1/2'>
          <source srcset="{IMG}/graves/fog@2.webp" media="(min-width: 620px)" type="image/webp" />
          <source srcset="{IMG}/graves/fog@1.webp" type="image/webp" />
          <img
            alt="Background fog to give aesthetic of graveyard"
            src="{IMG}/graves/fog@1.png"
            srcset="{IMG}/graves/fog@1.png 1x, {IMG}/graves/fog@2.png 2x"
            decoding=async loading=lazy
            />
        </picture>
      </div>
    </span>

  </div>
</div>

<style>

  @keyframes anim {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes anim-slow {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  .fog { z-index: 99999; }

  .animate-slow { animation: anim-slow 70s linear infinite; }
  .animate { animation: anim 40s linear infinite; }

  picture { filter: brightness(0) drop-shadow(2px 4px 6px black); }
  :global(.dark) picture { filter: brightness(1); }

  span > div { width: 600%; }
  @media (min-width: theme('screens.sm')) {
    span > div { width: 300%; }
  }
  picture img {
    @apply w-full h-full;
  }

</style>
