<script>
  export let max, stat, val
</script>

<span class='col-span-2 text-xs text-right'>{stat}</span>
{#if val < 50}
  <span class='-ml-1 font-bold text-xs text-red-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-4 h-2 rounded-md bg-red-300 ring-2 ring-red-100' />
{:else if val < 80}
  <span class='-ml-1 font-bold text-xs text-orange-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-4 h-2 rounded-md bg-orange-300 ring-2 ring-orange-100' />
{:else if val < 100}
  <span class='-ml-1 font-bold text-xs text-yellow-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-4 h-2 rounded-md bg-yellow-300 ring-2 ring-yellow-100' />
{:else if val < 120}
  <span class='-ml-1 font-bold text-xs text-lime-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-4 h-2 rounded-md bg-lime-300 ring-2 ring-lime-100' />
{:else}
  <span class='-ml-1 font-bold text-xs text-green-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-4 h-2 rounded-md bg-green-300 ring-2 ring-green-100' />
{/if}
