<script>

  export let sprite, name, types, level = '', moves, maxStat, held = '', ability = '', stats, nature = undefined

  import { capitalise } from '$lib/utils/string'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from 'svelte-icons-pack'
  import Hand from 'svelte-icons-pack/fa/FaSolidHandHolding'

  import ColorMap from '$lib/data/colors.json'
  import Tooltip from '$lib/components/core/Tooltip.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import MoveCard from '$lib/components/move-card.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { UNOWN } from '$utils/rewrites'
  import { Stars as Pattern } from '$utils/pattern'

  const canonname = name.replace(/-(Alola|Galar)/, '')

  const cols = types.map(t => ColorMap[t])
  const bgImg = Pattern(cols[1] || cols[0])

  const anim = ['bob'][Math.floor(Math.random() * 1)]
  const animDur = Math.floor(Math.random() * 4) + 4
  const animDelay = Math.floor(Math.random() * 10) / 10
</script>

<div class='card relative flex flex-col border dark:border-gray-900 bg-white dark:bg-gray-900 dark:shadow-lg rounded-lg'>
  <div
    style='--t-col: {cols[0]}; background-image: url("{bgImg}");'
    class='card__header flex justify-between pl-4 pt-4 pb-3 relative z-0 rounded-t-lg'
    >
    <div class='flex flex-row items-end gap-x-2'>
      {#if level}
        <div class='flex flex-col items-center'>
          <span class='text-xs -mb-2'>Level</span>
          <span class='text-3xl font-bold'>{level}</span>
          {#if level.startsWith('+') || level.startsWith('-')}
            <Tooltip>
              Calculated as your party's Max Level {level}
            </Tooltip>
          {/if}
        </div>
      {/if}
      <span class='relative text-xl mb-0.25 dark:sm:bg-transparent sm:bg-transparent pr-2 z-40'>
        <p class='-mb-1 w-auto relative text-xs dark:sm:bg-transparent sm:bg-transparent z-40 h-4'>
          {#if ability}
            <span class:cursor-help={!!ability.effect}>
              {#if ability.effect}
                <Tooltip>{ability.effect}</Tooltip>
              {/if}

              {ability.name}
            </span>
          {/if}
        </p>

        {capitalise(canonname)}

        {#if held}
          <div class='absolute right-0 -bottom-0.5 translate-x-full z-20 p-1 mb-1 flex flex-col cursor-help items-center'>
            <Tooltip>
              {held.name}: {held.effect?.replace(/^Held: +/g, '')}
            </Tooltip>
            <span>
              <PIcon type='item' name={held.sprite} />
            </span>
            <Icon src={Hand} className='-mt-3.5 fill-current dark:text-white' />
          </div>
        {/if}

      </span>

    </div>

    <div class='absolute -right-8 h-0'>
      <slot name=img />
      {#if sprite}
        <img width=96 height=96 style="--v-anim-dur: {animDur}s; --v-anim-delay: {animDelay}s" class='{anim} img__pkm -translate-y-16 h-40 w-auto' src={sprite} alt={name} />
      {:else}
        <img width=96 height=96
             src={UNOWN}
             style="--v-anim-dur: {animDur}s; --v-anim-delay: {animDelay}s" class='{anim} img__pkm scale-75 -translate-y-16 -translate-x-6 h-40 w-auto'
             alt='Unknown sprite for {name}'
             />
      {/if}
    </div>

    <div class='flex gap-x-1 absolute top-0 transform -translate-y-1/2'>
      {#each types as t}
        <TypeBadge type={t} />
      {/each}
    </div>
  </div>

  <div
    style='border-color: {cols[0]}'
    class='relative inline-flex bg-white dark:bg-gray-900  border-t-2 sm:items-center rounded-b-lg z-10'>

    {#if moves && moves.length}
      <div class='grid grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 w-3/5 sm:w-2/3 my-3 ml-4 gap-y-0 lg:gap-y-3'>
        {#each moves as m}
          <MoveCard {...m} stab={types.includes(m.type)} />
        {/each}
      </div>
    {/if}

    <div class={moves && moves.length ? 'w-2/5 sm:w-1/3 mr-4 sm:mt-0 mt-5' : 'w-full m-4'}>
      {#if $$slots.stats}
        <slot name='stats' />
      {:else}
        <StatBlock col={cols[0]} nature={nature} max={maxStat} {...stats} />
      {/if}
    </div>
  </div>

  <slot name="footer" id={canonname} />
</div>

<style>
  img {
    image-rendering: pixelated;
  }

  .card {
    box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  }

  .card__header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 8px 8px 0 0;
  }

  .card__header {
    z-index: 0;
    background-color: var(--t-col);
  }

  .card__header::before {
    z-index: -1;
    background: linear-gradient(130deg, white 40%, transparent);
  }

  :global(.dark) .card__header::before {
    background: linear-gradient(130deg, theme('colors.gray.900') 40%, transparent);
  }

  .img__pkm {
    min-width: 160px;
  }

  img { animation-delay: var(--v-anim-delay); }
  img.bob { animation: bob var(--v-anim-dur) ease infinite; }

  @keyframes bob {
    0%, 100% {transform: var(--tw-transform) scaleX(1) scaleY(1);}
    25%, 75% { transform: var(--tw-transform) scaleX(1.02) scaleY(0.95); }
    50% { transform: var(--tw-transform) scaleX(0.95) scaleY(1.03); }
  }
</style>
