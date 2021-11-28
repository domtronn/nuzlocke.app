<script>
  export let pokemon = [], className = ''

  import { fade } from 'svelte/transition'

  import Icon from 'svelte-icons-pack'
  import Badge from 'svelte-icons-pack/fi/FiRefreshCcw'
  import Ball from 'svelte-icons-pack/cg/CgPokemon'

  import { Stars as Pattern } from '$lib/utils/pattern'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import ColorMap from '$lib/data/colors.json'

  import StatBlock from '$lib/components/stat-block.svelte'

  $: atk = pokemon[0]
  $: atkCols = atk.types.map(t => ColorMap[t.toLowerCase()])
  $: atkBgImg = Pattern(atkCols[1] || atkCols[0])

  $: def = pokemon[1]
  $: defCols = def.types.map(t => ColorMap[t.toLowerCase()])
  $: defBgImg = Pattern(defCols[1] || defCols[0])

  const sprite = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

</script>

<div class='shadow-lg dark:text-gray-50 relative {className}'>

  <!-- Pokemon face off -->
  <div class='relative flex flex-row justify-around h-24 overflow-hidden -mt-8'>
    <!-- Colouring for types -->
    {#key `atk__${atk.name}`}
      <div in:fade={{ duration: 400, delay: 100 }} class='absolute bottom-0 top-0 left-0 mt-8 rounded-tl-lg overflow-hidden' style='width: 50%; background: {atkCols[0]};'>
        <div class='absolute inset-0' style='background-image: url("{atkBgImg}");' />
      </div>
    {/key}

    {#key `def__${def.name}`}
      <div in:fade={{ duration: 400, delay: 100 }} class='absolute bottom-0 top-0 left-1/2 mt-8 rounded-tr-lg overflow-hidden' style='width: 50%; background: {defCols[0]};'>
        <div class='absolute inset-0' style='background-image: url("{defBgImg}");' />
      </div>
    {/key}
    <div class='divider absolute rounded-t-lg bottom-0 top-0 left-0 mt-8' style='width: 100%;' />

    <!-- Images -->
    {#key `atk__${atk.name}`}
      <img in:fade={{ duration: 500 }} class='flip z-20 flex -mx-6 h-32 w-32' style='transform: scaleX(-1); ' src={sprite(atk.imgId)} />
    {/key}
    {#key `def__${def.name}`}
      <img in:fade={{ duration: 500 }} class='z-20 flex -mx-6 h-32 w-32' src={sprite(def.imgId)} />
    {/key}

    <!-- VS Icon -->
    <div class='absolute left-1/2 -translate-x-1/2 bottom-1 w-8 h-8'>
      <span class='flex'>
        <Icon className='absolute' size=1.4em src={Badge} />
        <Icon className='absolute dark:bg-gray-800 bg-white rounded-full -top-0.5 right-2' size=0.8em src={Ball} />
        <Icon className='absolute dark:bg-gray-800 bg-white rounded-full bottom-2 -left-0.5' size=0.8em src={Ball} />
      </span>
      <p class='text-2xl font-mono left-0.5 absolute bottom-7'>vs</p>
    </div>
  </div>

  <div
    class='separator w-full'
    style='background: linear-gradient(90deg, {atkCols[0]} 35%, {defCols[0]} 65%, {defCols[0]});'
  />

  <!-- Stat comparison -->
  <div class='relative flex flex-row gap-x-2 p-4 bg-white dark:text-gray-50 dark:bg-gray-900'>
    {#key `atk__${atk.name}`}
    <div class=flex-1>
      <span class='flex gap-x-2 mb-2 -ml-2 justify-start transform scale-75'>
        {#each atk.types as t}
          <TypeBadge type={t.toLowerCase()} />
        {/each}
      </span>
      <StatBlock max={250} {...atk.baseStats} col={atkCols[0]} compare={def.baseStats} side='left' />
    </div>
    {/key}

    {#key `def__${def.name}`}
    <div class=flex-1>
      <span class='flex gap-x-2 mb-2 -mr-1 justify-end transform scale-75'>
        {#each def.types as t}
          <TypeBadge type={t.toLowerCase()} />
        {/each}
      </span>
      <StatBlock max={250} {...def.baseStats} col={defCols[0]} compare={atk.baseStats} side='right' />
    </div>
    {/key}
  </div>

  <slot />

</div>

<style>
  img.flip { animation: bob-left 4.5s ease 0.3s infinite; }
  img {
    animation: bob 5.5s ease 0.3s infinite;
    image-rendering: pixelated;
  }

  @keyframes bob {
    0%, 100% {transform: var(--tw-transform) scaleX(1) scaleY(1);}
    25%, 75% { transform: var(--tw-transform) scaleX(1.03) scaleY(0.97); }
    50% { transform: var(--tw-transform) scaleX(0.99) scaleY(1.03); }
  }

  @keyframes bob-left {
    0%, 100% {transform: var(--tw-transform) scaleX(-1) scaleY(1);}
    25%, 75% { transform: var(--tw-transform) scaleX(-1.02) scaleY(0.97); }
    50% { transform: var(--tw-transform) scaleX(-0.96) scaleY(1.01); }
  }

  .separator { height: theme('borderWidth.2'); }
  :global(.dark) .divider { background: linear-gradient(30deg, transparent, theme('colors.gray.900') 40%, theme('colors.gray.900') 60%, transparent) }
  .divider { background: linear-gradient(30deg, transparent, theme('colors.white') 40%, theme('colors.white') 60%, transparent) }

</style>
