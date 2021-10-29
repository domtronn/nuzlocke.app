<script>
  export let max, atk, def, spd, spa, spe, hp
  const stats = { hp, atk, def, spa, spd, spe }
  const total = Object.values(stats).reduce((acc, it) => acc + it, 0)

  import StatBar from '$lib/components/stat-bar.svelte'

</script>

<div class='grid grid-cols-11 sm:grid-cols-7 gap-x-2 gap-y-1 items-center'>
  <span class='absolute top-0 -translate-y-1/2 -translate-x-1/2 right-2'>
    <b class='py-1 -ml-2 pl-2 pr-2.5'>{total}</b>
  </span>

  {#each Object.entries(stats) as [s, sval]}
    <StatBar stat={s} val={sval} max={max} />
  {/each}
</div>

<style>
  b {
    z-index: 5;
    position: relative;
  }

  b::after {
    content: '';
    background-color: white;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    left: 0;
    border-radius: 6px;
    z-index: -5;
    border: 1px solid #e5e7eb;
  }

  b::before {
    content: '';
    background-color: white;
    position: absolute;
    top: -1px;
    transform: translateY(calc(100% - 1px));
    left: -2px;
    right: 2px;
    width: calc(100% + 4px);
    height: calc(50% + 2px);
    z-index: -2;
  }

</style>
