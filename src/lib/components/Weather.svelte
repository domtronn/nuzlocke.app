<script>
  export let weather
  const Effect = {
    Fog: 'fog',
    Rain: 'rain',
    Hail: 'hail',
    Sunlight: 'sunlight',
    Sandstorm: 'sandstorm',

    PsychicTerran: 'psychic-terrain',
    MistyTerran: 'misty-terrain',
    GrassyTerran: 'grassy-terrain',
    ElectricTerran: 'electric-terrain',

    TrickRoom: 'trick-room'
  }

  // Rain
  import {Icon, Tooltip} from '$c/core'

  import { default as RainA } from '@iconify-icons/wi/showers'
  import { default as RainB } from '@iconify-icons/wi/rain-mix'

  const switcher = (node) => {
    const [a, b] = node.children
    const ts = node.getAttribute('data-interval') || 250
    const intervalId = setInterval(() => {
      a.classList.toggle('hidden')
      b.classList.toggle('hidden')
    }, ts)

    return { destroy () { clearInterval(intervalId) } }
  }
</script>

{#if weather === Effect.Rain}
  <span use:switcher class={$$restProps.class || ''}>
    {#if $$slots.tooltip}
      <Tooltip>
        <slot name=tooltip />
      </Tooltip>
    {/if}
    <Icon inline icon={RainA} />
    <Icon class='hidden' inline icon={RainB} />
  </span>
{/if}
