<script>
  export let max, stat, val
</script>

<span class='col-span-2 flex justify-end sm:col-span-2 text-xs text-right'>{stat}</span>
{#if val < 50}
  <span class='col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-red-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-5 sm:col-span-4 h-2 rounded-md dark:bg-red-600 bg-red-300 ring-2 dark:ring-red-400 ring-red-100' />
{:else if val < 80}
  <span class='col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-orange-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-5 sm:col-span-4 h-2 rounded-md dark:bg-orange-600 bg-orange-300 ring-2 dark:ring-orange-400 ring-orange-100' />
{:else if val < 100}
  <span class='col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-yellow-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-5 sm:col-span-4 h-2 rounded-md dark:bg-yellow-600 bg-yellow-300 ring-2 dark:ring-yellow-400 ring-yellow-100' />
{:else if val < 120}
  <span class='col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-lime-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-5 sm:col-span-4 h-2 rounded-md dark:bg-lime-600 bg-lime-300 ring-2 dark:ring-lime-400 ring-lime-100' />
{:else}
  <span class='col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-green-500 text-right'>{val}</span>
  <div style='width: {100 * val / max}%' class='col-span-5 sm:col-span-4 h-2 rounded-md dark:bg-green-600 bg-green-300 ring-2 dark:ring-green-400 ring-green-100' />
{/if}
