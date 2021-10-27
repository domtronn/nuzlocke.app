<script>
  export let sprite, name, types, level, moves, item

  import { capitalise } from '$lib/utils/string'

  import ColorMap from '$lib/data/colors.json'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import MoveCard from '$lib/components/move-card.svelte'

  import { Bubbles as Pattern } from '$lib/utils/pattern'

  const cols = types.map(t => ColorMap[t])
  const bgImg = Pattern(cols[1] || cols[0])
</script>

<div class='card flex flex-col border rounded-lg divide divide-y'>
  <div
    style='--t-col: {cols[0]}; background-image: url("{bgImg}")'
    class='card__header flex justify-between px-4 pt-4 pb-3 relative z-0 rounded-t-lg'
    >
    <div>
      <p class='font-bold'>{capitalise(name)}</p>
      <p class='text-xs'>Level <b>{level}</b></p>
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

  <div class='bg-white rounded-b-lg z-10'>
    <div class='grid grid-cols-2 grid-rows-2 w-2/3 my-3 mx-4 gap-y-4'>
      {#each moves as m}
        <MoveCard {...m} />
      {/each}
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

</style>
