<script>
  export let sprite, name, types, level, moves, maxStat, held, ability, stats

  import { capitalise } from '$lib/utils/string'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Hand from 'svelte-icons-pack/fa/FaSolidHandHolding'

  import ColorMap from '$lib/data/colors.json'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import MoveCard from '$lib/components/move-card.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { Stars as Pattern } from '$lib/utils/pattern'

  const cols = types.map(t => ColorMap[t])
  const bgImg = Pattern(cols[1] || cols[0])
</script>

<div class='card relative flex flex-col border rounded-lg divide divide-y'>
  <div
    style='--t-col: {cols[0]}; background-image: url("{bgImg}")'
    class='card__header flex justify-between pl-4 pt-4 pb-3 relative z-0 rounded-t-lg'
    >
    <div class='flex flex-row items-end gap-x-2'>
      {#if level}
        <div class='flex flex-col items-center'>
          <span class='text-xs -mb-2'>Level</span>
          <span class='text-3xl font-bold'>{level}</span>
        </div>
      {/if}
      <div>
        <p class='relative text-xl mb-0.25 bg-white pr-2 z-40'>
          {#if ability}
            <p
              class='-mb-1 w-auto relative text-xs bg-white z-40'
              >
              <span data-tooltip={ability.effect}>
                {ability.name}
              </span>
            </p>
          {/if}

          {capitalise(name)}
          {#if held}
            <div
              data-tooltip={held.effect}
              class='absolute right-0 bottom-0 translate-x-full z-20 p-1 mb-1 flex flex-col items-center'>
              <PIcon type='item' name={held.sprite} />
              <Icon src={Hand} className='-mt-3.5' />
            </div>
          {/if}
        </p>
      </div>

    </div>

    <div class='absolute -right-8 h-0'>
      <img class='img__pkm -translate-y-16 h-40 w-auto' src={sprite} alt={name} />
    </div>

    <div class='flex gap-x-1 absolute top-0 transform -translate-y-1/2'>
      {#each types as t}
        <TypeBadge type={t} />
      {/each}
    </div>
  </div>

  <div class='relative inline-flex sm:items-center bg-white rounded-b-lg z-10'>
    {#if moves && moves.length}
      <div class='grid grid-cols-1 sm:grid-cols-2 grid-rows-2 w-3/5 sm:w-2/3 my-3 ml-4 gap-y-0 sm:gap-y-3'>
        {#each moves as m}
          <MoveCard {...m} stab={types.includes(m.type)} />
        {/each}
      </div>
    {/if}

    <div class={moves && moves.length ? 'w-2/5 sm:w-1/3 mr-4 sm:mt-0 mt-5' : 'w-full m-4'}>
      <StatBlock max={maxStat} {...stats} />
    </div>
  </div>
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
    background: linear-gradient(to right, white 55%, transparent);
  }

  .img__pkm {
    min-width: 160px;
  }
</style>
