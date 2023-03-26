<script>
  export let effect
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

    TrickRoom: 'trick-room',
    DoubleBattle: 'double-battle'
  }

  // Rain
  import { Icon, Tooltip } from '$c/core'

  import { default as RainA } from '@iconify-icons/wi/showers'
  import { default as RainB } from '@iconify-icons/wi/rain-mix'

  import { Double } from '$icons'

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

{#if effect === Effect.Rain}
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


{#if effect === Effect.DoubleBattle}
  <span class={$$restProps.class || ''}>
    {#if $$slots.tooltip}
      <Tooltip>
        <slot name=tooltip />
      </Tooltip>
    {/if}
    <Icon inline icon={Double} />
  </span>
{/if}
