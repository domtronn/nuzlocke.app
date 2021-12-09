<script>
  export let time = 2000, variant = 'primary', icon

  import { fly } from 'svelte/transition'
  import Icon from 'svelte-icons-pack'

  let content
  let show = false, showtimeout
  export const toast = (d) => {
    show = true
    if (d.variant) variant = d.variant
    if (d.content) content = d.content
    if (d.icon) icon = d.icon

    clearTimeout(showtimeout)
    showtimeout = setTimeout(_ => show = false, time)
  }
</script>

{#if show}
  <div transition:fly={{ y: 50 }} class={variant}>
    {#if icon}
      <Icon src={icon} className='fill-current mr-2' />
    {/if}
    <slot />
    {content}
  </div>
{/if}

<style>
  :root {
    --bg: theme('colors.gray.100');
    --fg: theme('colors.gray.900');
  }

  :global(.dark) {
    --bg: theme('colors.gray.900')
    --fg: theme('colors.gray.100')
  }

  :global(.dark) .success {
    --bg: theme('colors.green.600');
    --fg: theme('colors.green.50');
  }

  .success {
    --bg: theme('colors.green.500');
    --fg: theme('colors.green.50');
  }

  .failure {
    --bg: theme('colors.hotpink.500');
    --fg: theme('colors.hotpink.50');
  }

  div {
    @apply px-12 w-auto py-2 absolute bottom-0 rounded-t-xl left-1/2 -translate-x-1/2 font-medium inline-flex items-center;
    z-index: 50000000;

    background-color: var(--bg);
    color: var(--fg);
    border-color: var(--fg);
  }

</style>
