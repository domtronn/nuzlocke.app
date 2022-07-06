<script>
  export let pokemon = [], className = ''

  import { fade } from 'svelte/transition'

  import Icon from 'svelte-icons-pack'
  import Hand from 'svelte-icons-pack/fa/FaSolidHandHolding'
  import Badge from 'svelte-icons-pack/fi/FiRefreshCcw'
  import Ball from 'svelte-icons-pack/cg/CgPokemon'

  import { Tooltip, PIcon } from '$lib/components/core'
  import ColorMap from '$lib/data/colors.json'

  import { SPRITE } from '$utils/rewrites'
  import { Stars as Pattern } from '$utils/pattern'

  $: atk = pokemon[0]
  $: atkCols = atk.types.map(t => ColorMap[t.toLowerCase()])
  $: atkBgImg = Pattern(atkCols[1] || atkCols[0])

  $: def = pokemon[1]
  $: defCols = def.types.map(t => ColorMap[t.toLowerCase()])
  $: defBgImg = Pattern(defCols[1] || defCols[0])

  const sprite = id => `${SPRITE}/${status === 6 ? 'shiny/' : ''}${id}.png?auto=format`
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
      <img alt={atk.name} in:fade={{ duration: 500 }} class='flip z-20 flex -mx-6 h-32 w-32' style='transform: scaleX(-1); ' src={sprite(atk.imgId, atk.status)} />
    {/key}
    {#key `def__${def.name}`}
      <img alt={def.name} in:fade={{ duration: 500 }} class='z-20 flex -mx-6 h-32 w-32' src={sprite(def.imgId)} />
    {/key}

      {#if def?.original?.held}
        {#key def.original.held.name}
          <div style='transform: var(--tw-transform) scaleX(-1)' class='absolute right-0 top-1/2 -translate-y-3 -translate-x-5 z-20 p-1 mb-1 flex flex-col cursor-help items-center'>
            <Tooltip>
              {def.original.held.name}: {def.original.held.effect.replace(/^Held: +/g, '')}
            </Tooltip>
            <span>
              <PIcon type='item' name={def.original.held.sprite} />
            </span>
            <Icon src={Hand} className='-mt-3.5 fill-current dark:text-white' />
          </div>
        {/key}
      {/if}

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
