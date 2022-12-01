<script>
  import { fade, fly } from 'svelte/transition'
  import TypeBadge from '$lib/components/type-badge.svelte'

  export let type, weak, resist, count, i
  export let duration = 400, delay = 100 * i

  const resistpct = Math.floor((resist || 0) * 100 / count)
  const weakpct = Math.floor((weak || 0) * 100 / count)
</script>

<td in:fly|once={{ duration, x: 50, delay }}>
  {#if weak}
    <div class='weak c-{Math.floor(Math.min(weakpct, 49) / 10)} float-right'
         style='width: {weakpct}%;'
         >
      <span>
        <b>{weak}</b>
        <i>({weakpct}%)</i>
      </span>
    </div>
  {/if}
</td>

<td in:fade|once={{ duration, delay }}>
  <TypeBadge
    className='w-full justify-center leading-4 sm:leading-5'
    {type}
    />
</td>

<td in:fly|once={{ duration, delay, x: -50 }}>
  {#if resist}
    <div class='resist c-{Math.floor(Math.min(resistpct, 49) / 10)} float-left'
         style='width: {resistpct}%;'
         >
      <span>
        <b>{resist}</b>
        <i>({resistpct}%)</i>
      </span>
    </div>
  {/if}
</td>

<style lang="postcss">
  span { @apply top-1/2 -translate-y-1/2 absolute sm:w-16 w-8 }
  .resist i, .weak i { @apply tracking-tight hidden sm:inline-block }

  .resist, .weak { position: relative; }
  .resist span { @apply -right-1 translate-x-full }
  .weak span { @apply -left-1 -translate-x-full }
  
  :global(.dark) .resist.c-0 { background-color: theme('colors.lime.900')}
  :global(.dark) .resist.c-1 { background-color: theme('colors.lime.700')}
  :global(.dark) .resist.c-2 { background-color: theme('colors.lime.600')}
  :global(.dark) .resist.c-3 { background-color: theme('colors.lime.500')}
  :global(.dark) .resist.c-4 { background-color: theme('colors.lime.400')}

  .resist.c-0 { background-color: theme('colors.lime.100')}
  .resist.c-1 { background-color: theme('colors.lime.200')}
  .resist.c-2 { background-color: theme('colors.lime.300')}
  .resist.c-3 { background-color: theme('colors.lime.400')}
  .resist.c-4 { background-color: theme('colors.lime.500')}
  
  :global(.dark) .weak.c-0 { background-color: theme('colors.red.900')}
  :global(.dark) .weak.c-1 { background-color: theme('colors.red.800')}
  :global(.dark) .weak.c-2 { background-color: theme('colors.red.700')}
  :global(.dark) .weak.c-3 { background-color: theme('colors.red.600')}
  :global(.dark) .weak.c-4 { background-color: theme('colors.red.500')}

  .weak.c-0 { background-color: theme('colors.red.100')}
  .weak.c-1 { background-color: theme('colors.red.200')}
  .weak.c-2 { background-color: theme('colors.red.300')}
  .weak.c-3 { background-color: theme('colors.red.400')}
  .weak.c-4 { background-color: theme('colors.red.500')}

  td + td { @apply w-auto py-1; }
  td, td + td + td { @apply w-60 lg:w-60 text-tiny py-0; }

  td { @apply table-cell align-middle h-full relative }
  td { text-align: right; }
  td + td + td { text-align: left; }
  
  div { @apply rounded-lg h-3 my-0.5 mx-2 }
</style>
