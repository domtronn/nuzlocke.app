<script>
  export let title, src = false, name = false, disabled = false, containerClassName = '', className = '', color = 'gray', rounded = false

  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-icons-pack'
  import PIcon from '$lib/components/core/PokemonIcon.svelte'

  const dispatch = createEventDispatcher()
  const onclick = e => dispatch('click', e)
</script>

<button
  disabled={disabled}
  aria-label={title}
  title={title}
  on:click={onclick}
  class:disabled={disabled}
  class:rounded-lg={rounded}
  class='{color} {containerClassName} group flex items-center border-2 ring-2 ring-transparent transition hover:grayscale-0 grayscale shadow-sm'
>
  {#if src}
    <Icon className='fill-current m-2 {className}' src={src} />
  {:else if name}
    <PIcon className='transition-opacity opacity-50 group-hover:opacity-100 {className}' name={name} type='item' />
  {/if}
  <slot />
</button>

<style>
  :root {
    --icb-hover: theme('colors.gray.800');
    --icb-active: theme('colors.gray.900');
    --icb-bg: theme('colors.gray.400');
  }

  :global(.dark) {
    --icb-hover: theme('colors.gray.200');
    --icb-active: theme('colors.gray.100');
    --icb-bg: theme('colors.gray.800');
  }

  .orange {
    --icb-hover: theme('colors.orange.400');
    --icb-active: theme('colors.orange.400');
    --icb-bg: theme('colors.orange.200');
  }

  :global(.dark) .orange {
    --icb-active: theme('colors.orange.300');
    --icb-bg: theme('colors.orange.700');
  }

  .green {
    --icb-hover: theme('colors.green.400');
    --icb-active: theme('colors.green.500');
    --icb-bg: theme('colors.green.100');
  }

  :global(.dark) .green {
    --icb-active: theme('colors.green.400');
    --icb-bg: theme('colors.green.700');
  }

  :global(.dark) button,
  :global(.dark) button.disabled
  {
    background-color: theme('colors.gray.700');
    border-color: theme('colors.gray.600');
  }

  button,
  button.disabled {
    background-color: theme('colors.white');
    border-color: theme('colors.gray.200');
    color: theme('colors.gray.400');
  }

  button.disabled {
    opacity: 0.5;
    cursor: initial;
  }

  button:not(.disabled):hover {
    border-color: var(--icb-hover);
    color: var(--icb-hover);
  }

  button:not(.disabled):hover:active {
    --tw-ring-color: var(--icb-bg);
    border-color: var(--icb-active);
    color: var(--icb-active);
  }
</style>
