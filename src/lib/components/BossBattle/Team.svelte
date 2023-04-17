<script>
  export let width
  export let type = 'attack',
    team = []

  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import { getContext } from 'svelte'
  import { createImgUrl } from '$utils/rewrites'

  const { getPkmn } = getContext('game')
  const sprite = (p, status) =>
    createImgUrl(p, { ext: 'png', shiny: status === 6 })

  const islast = (type, i, team) => i === 5
  const ispenum = (type, i, team) =>
    type == 'attack' ? (team.length === 6 ? i === 1 : i === 0) : i === 4
</script>

<div
  style="min-width: var(--w);"
  class:flip={type === 'attack'}
  class:flex-row-reverse={type === 'attack'}
  class:translate-y-3={team.length > 1}
  class:team-max={team.length === 6}
  class="team-grid flex justify-center"
>
  {#each team as p, i (p?.original?.customId || p?.original?.location || i)}
    <span class:last={islast(type, i, team)} animate:flip>
      <img
        in:fade={{ duration: 200 }}
        alt={p.name}
        style="--bob-delay: {(2 * i) / 10}s"
        class="z-20 -mx-2 flex h-24 w-24"
        src={sprite({ ...p.original, ...p })}
      />
    </span>
  {/each}
</div>

<style>
  :root {
    --bob-delay: 0.2s;
  }

  img {
    image-rendering: pixelated;
    animation: bob 5.5s ease var(--bob-delay) infinite;
  }

  @keyframes bob {
    0%,
    100% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(1) scaleY(1);
    }
    25%,
    75% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(1.03) scaleY(0.97);
    }
    50% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(0.99) scaleY(1.03);
    }
  }

  @keyframes bob-left {
    0%,
    100% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-1) scaleY(1);
    }
    25%,
    75% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-1.02) scaleY(0.97);
    }
    50% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-0.96) scaleY(1.01);
    }
  }

  .flip img,
  img.flip {
    animation: bob-left 4.5s ease var(--bob-delay) infinite;
    @apply -scale-x-100;
  }

  .team-grid > * {
    transition: margin 0.2s ease;
  }

  .team-grid > *:nth-child(odd) {
    @apply z-10 translate-y-4;
  }
  .team-grid > *:nth-child(even) {
    @apply z-0 -translate-y-4;
  }

  .team-grid.flip > * {
    @apply -ml-12;
  }
  .team-grid:not(.flip) > * {
    @apply -mr-12;
  }

  .team-grid.flip > *:first-child {
    @apply -mr-16;
  }
  .team-grid:not(.flip) > *:first-child {
    @apply -ml-12;
  }

  .team-grid.team-max.flip > *:first-child {
    @apply -mr-24;
  }
  .team-grid.team-max:not(.flip) > *:first-child {
    @apply -ml-20;
  }

  .team-grid.flip .last {
    @apply absolute top-0 left-12;
  }
  .team-grid:not(.flip) .last {
    @apply absolute top-0 right-12;
  }
</style>
