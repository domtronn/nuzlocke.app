<script>
  export let width
  export let type = 'attack',
    team = []

  let teamOrder = []
  $: teamOrder = type === 'attack' ? [...team].reverse() : team

  import { flip } from 'svelte/animate'

  import { getContext } from 'svelte'
  import { createImgUrl } from '$utils/rewrites'

  const { getPkmn } = getContext('game')
  const sprite = (p, status) =>
    createImgUrl(p, { ext: 'png', shiny: status === 6 })

  console.log('teamOrder', teamOrder)
</script>

<div
  style="min-width: var(--w);"
  class:flip={type === 'attack'}
  class:translate-x-6={type !== 'attack'}
  class:translate-y-3={teamOrder.length > 1}
  class="team-grid inline-flex items-end justify-center"
>
  {#each teamOrder as p, i (p?.original?.customId || p?.original?.location || i)}
    <span animate:flip>
      <img
        alt={p.name}
        class="z-20 -mx-2 flex h-24 w-24"
        src={sprite({ ...p.original, ...p })}
      />
    </span>
  {/each}
</div>

<style>
  img {
    image-rendering: pixelated;
  }

  .flip img,
  img.flip {
    @apply -scale-x-100;
  }

  .team-grid::before {
    content: '';
  }

  .team-grid :global(*:last-child) {
    @apply !mr-0;
  }
  .team-grid.flip :global(*:first-child) {
    @apply !ml-0;
  }

  .team-grid > :global(*:nth-child(2n + 1)) {
    @apply z-10 -mx-12 translate-y-4;
  }
  .team-grid > :global(*:nth-child(2n)) {
    @apply z-0 -translate-y-4;
  }
</style>
