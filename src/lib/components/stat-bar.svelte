<script>
  export let max, stat, val, mod = 1, className = ''

  import Icon from 'svelte-icons-pack'
  import Priority from 'svelte-icons-pack/bi/BiSolidChevronUp'

  let c
  if (val < 50) c = 'poor'
  else if (val < 80) c = 'meh'
  else if (val < 100) c = 'okay'
  else if (val < 120) c = 'good'
  else c = 'great'

</script>

<span
  class='col-span-2 flex justify-end items-center sm:col-span-2 text-xs text-right {className}'
  class:pos={mod > 1}
  class:neg={mod < 1}
>
    {#if mod !== 1}
      <Icon className='fill-current {mod < 1 ? 'transform rotate-180' : ''}' src={Priority} />
    {/if}
    {stat}
</span>

<span class='{c} {className} transition col-span-3 sm:col-span-1 -ml-1 font-bold text-xs text-right'>{val}</span>
<div style='width: {100 * val / max}%' class='{c} {className} transition col-span-5 sm:col-span-4 h-2 rounded-md ring-2' />

<style>

  .pos { color: theme('colors.blue.400'); }
  .neg { color: theme('colors.orange.600'); }
  :global(.dark) .pos { color: theme('colors.blue.300'); }
  :global(.dark) .neg { color: theme('colors.orange.300'); }

  .poor { --stat-col: theme('colors.red.300'); --stat-col-ring: theme('colors.red.100'); }
  .meh { --stat-col: theme('colors.orange.300'); --stat-col-ring: theme('colors.orange.100'); }
  .okay { --stat-col: theme('colors.yellow.300'); --stat-col-ring: theme('colors.yellow.100'); }
  .good { --stat-col: theme('colors.lime.300'); --stat-col-ring: theme('colors.lime.100'); }
  .great { --stat-col: theme('colors.green.300'); --stat-col-ring: theme('colors.green.100'); }

  :global(.dark) .great { --stat-col: theme('colors.green.600'); --stat-col-ring: theme('colors.green.400'); }
  :global(.dark) .good { --stat-col: theme('colors.lime.600'); --stat-col-ring: theme('colors.lime.400'); }
  :global(.dark) .okay { --stat-col: theme('colors.yellow.600'); --stat-col-ring: theme('colors.yellow.400'); }
  :global(.dark) .meh { --stat-col: theme('colors.orange.600'); --stat-col-ring: theme('colors.orange.400'); }
  :global(.dark) .poor { --stat-col: theme('colors.red.600'); --stat-col-ring: theme('colors.red.400'); }

  div {
    background-color: var(--stat-col);
    --tw-ring-color: var(--stat-col-ring);
  }

  span { color: var(--stat-col); }
  :global(.dark) span { color: var(--stat-col-ring); }

</style>
