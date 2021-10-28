<script>
  export let sprite, name, types, level, moves, maxStat, stats, item

  import { capitalise } from '$lib/utils/string'

  import ColorMap from '$lib/data/colors.json'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import MoveCard from '$lib/components/move-card.svelte'
  import StatBlock from '$lib/components/stat-block.svelte'

  import { Stars as Pattern } from '$lib/utils/pattern'

  const cols = types.map(t => ColorMap[t])
  const bgImg = Pattern(cols[1] || cols[0])
</script>

<div class='card flex flex-col border rounded-lg divide divide-y'>
  <div
    style='--t-col: {cols[0]}; background-image: url("{bgImg}")'
    class='card__header flex justify-between px-4 pt-4 pb-3 relative z-0 rounded-t-lg'
    >
    <div class='flex flex-row items-end gap-x-2'>
      <div class='flex flex-col items-center'>
        <span class='text-xs -mb-2'>Level</span>
        <span class='text-3xl font-bold'>{level}</span>
      </div>
      <p class='text-xl mb-0.25'>{capitalise(name)}</p>
    </div>

    <div class='h-0'>
      <img class='-translate-y-16 h-40' src={sprite} alt={name} />
    </div>

    <div class='flex gap-x-1 absolute top-0 transform -translate-y-1/2'>
      {#each types as t}
        <TypeBadge type={t} />
      {/each}
    </div>
  </div>

  <div class='inline-flex items-center bg-white rounded-b-lg z-10'>
    <div class='grid grid-cols-2 grid-rows-2 w-2/3 my-3 ml-4 gap-y-4'>
      {#each moves as m}
        <MoveCard {...m} />
      {/each}
    </div>

    <div class='w-1/3 mr-4'>
      <StatBlock max={maxStat} {...stats} />
    </div>

  </div>
</div>

<style>
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
    background: linear-gradient(to right, white 33%, transparent);
  }

  .dark .card__header::before {
    z-index: -1;
    background: linear-gradient(to right, #1f2937 33%, transparent);
  }

</style>
