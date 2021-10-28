<script>
  export let max, showHint, atk, def, spdef, spatk, spd, hp
  const stats = { hp, atk, def, spdef, spatk, spd }
  const total = Object.values(stats).reduce((acc, it) => acc + it, 0)

  import StatBar from '$lib/components/stat-bar.svelte'

</script>

<div class='grid grid-cols-7 gap-x-2 gap-y-1 items-center'>
  <span class='col-span-3' />
  <span class='col-span-4 -mb-1'><b>{total}</b></span>

  {#each Object.entries(stats) as [s, sval]}
    <StatBar stat={s} val={sval} max={max} />
  {/each}
</div>
