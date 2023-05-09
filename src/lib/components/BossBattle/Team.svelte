<script>
  export let type = 'attack',
    team = []

  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import { createImgUrl } from '$utils/rewrites'

  const sprite = (p, status) => {
    return createImgUrl(
      { imgId: p?.original?.sprite || p?.imgId, imgUrl: p.imgUrl },
      { ext: 'png', shiny: status === 6 }
    )
  }

  const islast = (type, i) => i === 5
</script>

<div
  class:flip={type === 'attack'}
  class:flex-row-reverse={type === 'attack'}
  class="team-grid team-grid__{team.length} flex h-10 justify-evenly md:h-auto md:justify-center"
>
  {#each team as p, i (p?.original?.customId || p?.original?.location || i)}
    <span
      class="z-20 -mx-2 flex h-14 w-14 md:h-24 md:w-24"
      class:last={islast(type, i, team)}
      animate:flip
    >
      <img
        in:fade={{ duration: 200 }}
        style="--bob-delay: {(2 * i) / 10}s"
        alt={p.name}
        src={sprite(p)}
      />
    </span>
  {/each}
</div>

<style lang="postcss">
  :root {
    --bob-delay: 0.2s;
  }

  img {
    image-rendering: pixelated;
    animation: bob 5.5s ease var(--bob-delay) infinite;
  }

  .flip img {
    image-rendering: pixelated;
    animation: bob-left 5.5s ease var(--bob-delay) infinite;
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

  .flip img {
    /* animation: bob-left 4.5s ease var(--bob-delay) infinite; */
    @apply -scale-x-100;
  }

  /* -------------- Team Grid styles --------------- */
  /* .team-grid, .team-grid span, .team-grid img { @apply transition; } */
  .team-grid {
    @apply flex-1;
  }
  .team-grid > span {
    @apply -mx-6 scale-125;
  }

  .team-grid > span:nth-child(even) {
    @apply z-10 -translate-y-8;
  }

  .team-grid > span:nth-child(odd) {
    @apply z-20 -translate-y-2;
  }

  .team-grid__1.flip img {
    @apply -translate-y-4 scale-y-[1.75] -scale-x-[1.75];
  }
  .team-grid__2.flip img {
    @apply -translate-y-0 scale-y-[1.25] -scale-x-[1.25];
  }
  .team-grid__3.flip img {
    @apply -translate-y-1 scale-y-[1.2] -scale-x-[1.2];
  }
  .team-grid__4.flip img {
    @apply -translate-y-0 scale-y-[1.1] -scale-x-[1.1];
  }

  .team-grid__1:not(.flip) img {
    @apply -translate-y-4 scale-y-[1.75] scale-x-[1.75];
  }
  .team-grid__2:not(.flip) img {
    @apply -translate-y-0 scale-y-[1.25] scale-x-[1.25];
  }
  .team-grid__3:not(.flip) img {
    @apply -translate-y-1 scale-y-[1.2] scale-x-[1.2];
  }
  .team-grid__4:not(.flip) img {
    @apply -translate-y-0 scale-y-[1.1] scale-x-[1.1];
  }

  @media (min-width: 350px) {
    .team-grid {
      @apply translate-y-1;
    }

    .team-grid > span {
      @apply -mx-8 scale-125;
    }

    .team-grid > span:nth-child(even) {
      @apply z-10 -translate-y-8;
    }
  }

  @media (min-width: theme('screens.md')) {
    .team-grid {
      @apply -translate-y-2;
    }

    .team-grid > span {
      @apply -mx-6;
    }

    .team-grid__6 > span {
      @apply -mx-7;
    }

    .team-grid > span:nth-child(even) {
      @apply z-10 -translate-y-8;
    }

    .team-grid > span:nth-child(odd) {
      @apply z-20 translate-y-2;
    }

    .team-grid.team-grid__1 {
      @apply -translate-y-5;
    }

    .team-grid__1:not(.flip) img,
    .team-grid__2:not(.flip) img,
    .team-grid__3:not(.flip) img,
    .team-grid__4:not(.flip) img {
      @apply translate-y-0 scale-100;
    }

    .team-grid__1.flip img,
    .team-grid__2.flip img,
    .team-grid__3.flip img,
    .team-grid__4.flip img {
      @apply translate-y-0 scale-100 -scale-x-100;
    }
  }
</style>
