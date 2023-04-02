<script>
  import { capitalise } from '$utils/string'
  export let effect
  const Effect = {
    Fog: 'fog',
    Rain: 'rain',
    Hail: 'hail',
    Sunlight: 'sunlight',
    Sandstorm: 'sandstorm',

    PsychicTerrain: 'psychic-terrain',
    MistyTerrain: 'misty-terrain',
    GrassyTerrain: 'grassy-terrain',
    ElectricTerrain: 'electric-terrain',

    DoubleBattle: 'double-battle'
  }

  const DescriptionMap = {
    [Effect.Rain]: 'Increases the effectiveness of Water-type moves by ½ and reduces the effectiveness of Fire-type moves by ½. Thunder and Hurricane never miss.',
    [Effect.Sunlight]: 'Increases the effectiveness of Fire-type moves by ½ and reduces the effectiveness of Water-type moves by ½. Lowers accuracy of Thunder and Hurricane to 50%.',
    [Effect.Sandstorm]: 'At the end of each turn, damages each Pokémon for 1/16th of its maximum HP, unless immune. Improves the Sp. Def of Rock-types by ½.',
    [Effect.Hail]: 'At the end of each turn, damages each Pokémon for 1/16th of its maximum HP, unless immune. Blizzard never misses.',

    [Effect.ElectricTerrain]: 'Boosts the power of Electric-type moves. Pokémon cannot be affected by sleep status.',
    [Effect.PsychicTerrain]: 'Boosts the power of Psychic-type moves. Priority moves have no effect.',
    [Effect.MistyTerrain]: 'Halves the power of Dragon-type moves. Pokémon cannot be affected by status conditions.',
    [Effect.GrassyTerrain]: 'Boosts the power of Grass-type moves. At the end of each turn, the terrain restores each Pokémon\'s HP by 1/16th.',
  }

  // Rain
  import { Icon, Tooltip } from '$c/core'

  import { default as RainA } from '@iconify-icons/wi/showers'
  import { default as RainB } from '@iconify-icons/wi/rain-mix'
  import { default as Snow } from '@iconify-icons/tabler/snowflake'
  import { default as Sun } from '@iconify-icons/wi/day-sunny'
  import { default as Sandstorm } from '@iconify-icons/wi/sandstorm'

  import { default as Terrain } from '@iconify-icons/gg/terrain'
  import { default as Psychic } from '@iconify-icons/ph/hand-eye'
  import { default as Electric } from '@iconify-icons/ph/lightning-bold'
  import { default as Grass } from '@iconify-icons/ph/leaf-bold'
  import { default as Mist } from '@iconify-icons/wi/fog'

  import { Double } from '$icons'

  const switcher = (node, opts) => {
    const [a, b] = node.children
    const ts = opts?.interval || 250
    const intervalId = setInterval(() => {
      a.classList.toggle('hidden')
      b.classList.toggle('hidden')
    }, ts)

    return { destroy () { clearInterval(intervalId) } }
  }
</script>

{#if effect !== Effect.DoubleBattle}
  <div class='relative {$$restProps.class || ''}'>
    <Tooltip>
      <b>Permanent {capitalise(effect).replace('-', ' ')}</b>
      {#if DescriptionMap?.[effect]}
        <p>{DescriptionMap[effect]}</p>
      {/if}
    </Tooltip>

    {#if effect.includes('-terrain')}
      <Icon class='-bottom-2 absolute transform scale-y-50 scale-x-110 opacity-50' inline icon={Terrain} />
    {/if}

    {#if effect === Effect.MistyTerrain}
      <span>
        <Icon class='transform scale-75' inline icon={Mist} />
        <Icon class='hidden transform -scale-x-75 scale-75' inline icon={Mist} />
      </span>
    {:else if effect === Effect.PsychicTerrain}
      <Icon class='transform scale-50' inline icon={Psychic} />
    {:else if effect === Effect.ElectricTerrain}
      <Icon class='transform scale-50' inline icon={Electric} />
    {:else if effect === Effect.GrassyTerrain}
      <Icon class='transform scale-50' inline icon={Grass} />

    {:else if effect === Effect.Rain}
      <span use:switcher>
        <Icon inline icon={RainA} />
        <Icon class='hidden' inline icon={RainB} />
      </span>

    {:else if effect === Effect.Hail}
      <span use:switcher={{ interval: 750 }}>
        <Icon class='transform scale-75' inline icon={Snow} />
        <Icon class='hidden transform scale-75 -rotate-30 origin-center' inline icon={Snow} />
      </span>

    {:else if effect === Effect.Sunlight}
      <span use:switcher={{ interval: 750 }}>
        <Icon class='transform scale-25' inline icon={Sun} />
        <Icon class='hidden transform scale-110 origin-center' inline icon={Sun} />
      </span>
    {:else if effect === Effect.Sandstorm}
        <span use:switcher={{ interval: 1000 }}>
          <Icon inline icon={Sandstorm} />
          <Icon class='hidden transform -scale-y-100 origin-center' inline icon={Sandstorm} />
        </span>
    {/if}
  </div>
{/if}

{#if effect === Effect.DoubleBattle}
  <span class={$$restProps.class || ''}>
    <Tooltip>
      <b>Double Battle</b>
    </Tooltip>
    <Icon inline icon={Double} />
  </span>
{/if}

<style>
  .field::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: 1px;
    width: 100%;
    @apply bg-gray-50;
  }
</style>
