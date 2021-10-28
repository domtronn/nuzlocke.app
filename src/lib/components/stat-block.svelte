<script>
  export let max, atk, def, spdef, spatk, spd, hp
  const stats = { hp, atk, def, spdef, spatk, spd }
  const total = Object.values(stats).reduce((acc, it) => acc + it, 0)
</script>

<div class='grid grid-cols-3 gap-x-2 gap-y-1 items-center'>
  {#each Object.entries(stats) as [s, sval]}
    <span class='text-xs text-right'>{s}</span>
    {#if sval < 50}
      <div style='width: {100 * sval / max}%' class='col-span-2 h-2 rounded-md bg-red-300 ring-2 ring-red-100' />
    {:else if sval < 80}
      <div style='width: {100 * sval / max}%' class='col-span-2 h-2 rounded-md bg-orange-300 ring-2 ring-orange-100' />
    {:else if sval < 100}
      <div style='width: {100 * sval / max}%' class='col-span-2 h-2 rounded-md bg-yellow-300 ring-2 ring-yellow-100' />
    {:else if sval < 120}
      <div style='width: {100 * sval / max}%' class='col-span-2 h-2 rounded-md bg-lime-300 ring-2 ring-lime-100' />
    {:else}
      <div style='width: {100 * sval / max}%' class='col-span-2 h-2 rounded-md bg-green-300 ring-2 ring-green-100' />
    {/if}
  {/each}
  <span />
  <span><b>{total}</b></span>
</div>
