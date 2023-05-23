<script>
  export let i, maxRows
</script>

<div
  class='text-center row row--{i}'
  style='--scale: {Math.min(1.6, (Math.round((i * i) / 2) + 10) / 10)}; --translate: {(maxRows - i) * 10}px; --margin: -{Math.min(50, (maxRows - i) * 10)}px;'
>
  <slot />
</div>

<style>

  @media (min-width: theme('screens.md')) {
    .row--0 > :global(*) { @apply -mx-4 -mb-16; }
    .row--1 > :global(*) { @apply -mx-3 -mb-12; }
    .row--2 > :global(*) { @apply -mx-2 -mb-8; }
    .row--3 > :global(*) { @apply -mx-1; }

    div {
      transform: scale(var(--scale)) translateY(var(--translate));
      margin-top: var(--margin);
    }
  }
</style>
