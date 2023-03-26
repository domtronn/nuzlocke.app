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

  import { default as HailA } from '@iconify-icons/wi/snow'
  import { default as HailB } from '@iconify-icons/wi/snow-wind'
  import { default as RainA } from '@iconify-icons/wi/showers'
  import { default as RainB } from '@iconify-icons/wi/rain-mix'
  import { default as Sun } from '@iconify-icons/wi/day-sunny'
  import { default as Sandstorm } from '@iconify-icons/wi/sandstorm'

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
    <Tooltip>
      Permanent Rain
    </Tooltip>
    <Icon inline icon={RainA} />
    <Icon class='hidden' inline icon={RainB} />
  </span>
{/if}

{#if effect === Effect.Hail}
  <span use:switcher class={$$restProps.class || ''}>
    <Tooltip>
      Permanent Hail
    </Tooltip>
    <Icon inline icon={RainA} />
    <Icon class='hidden' inline icon={RainB} />
  </span>
{/if}

{#if effect === Effect.Sunlight}
  <span use:switcher class={$$restProps.class || ''}>
    <Tooltip>
      Permanent Harsh Sunlight
    </Tooltip>
    <span use:switcher data-interval=750>
    <Icon class='transform scale-90' inline icon={Sun} />
    <Icon class='hidden transform scale-110 origin-center' inline icon={Sun} />
  </span>
{/if}

{#if effect === Effect.Sandstorm}
  <span use:switcher data-interval=1000>
    <Tooltip>
      Permanent Sandstorm
    </Tooltip>
    <Icon inline icon={Sandstorm} />
    <Icon class='hidden transform -scale-y-100 origin-center' inline icon={Sandstorm} />
  </span>
{/if}

{#if effect === Effect.DoubleBattle}
  <span class={$$restProps.class || ''}>
    <Tooltip>
      Double Battle
    </Tooltip>
    <Icon inline icon={Double} />
  </span>
{/if}
