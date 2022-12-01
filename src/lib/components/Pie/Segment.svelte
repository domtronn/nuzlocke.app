<script>
  export let offset, value, color, over50
</script>

<div
  data-value={value}
  data-offset={offset}
  data-over50={over50}
  style={`--color: ${color}; ${over50 ? '--over50: 1;' : ''}
          --offset: ${offset};
          --value: ${value};
          --a: ${over50 ? '-100%;' : '0;'}
          --b: ${over50 ? '200%;' : '100%;'}`}
  />

<style lang="postcss">
  div:after,
  div:before {
    background: var(--color, #ff00aa);
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
  }

  div:after {
    opacity: var(--over50, 0);
  }

  div:before {
    --degrees: (var(--value) / 100) * 360;
    transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
    transform-origin: 50% 0%;
  }

  div {
    --degrees: (var(--offset) / 100) * 360;

    clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
    height: 100%;
    position: absolute;
    transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg));
    transform-origin: 50% 100%;
    width: 100%;
    z-index: calc(1 + var(--over50));
  }
</style>
