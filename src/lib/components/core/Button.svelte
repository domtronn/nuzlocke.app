<script>
  import { createEventDispatcher } from 'svelte'

  export let disabled, className = ''

  const dispatch = createEventDispatcher()
  const onclick = _ => !disabled && dispatch('click')
</script>

<button
  on:click={onclick}
  class:disabled={disabled}
  class='border-2 ring-2 ring-transparent rounded-lg px-4 py-2 transition-colors {className}'
>
  <slot />
</button>

<style>
  :root {
    --b-fg: theme('colors.gray.800');
    --b-bg: theme('colors.gray.100');
    --b-light-1: theme('colors.indigo.50');
    --b-light-2: theme('colors.indigo.300');
    --b-highlight-1: theme('colors.indigo.600');
    --b-highlight-2: theme('colors.indigo.700');

  }

  :global(.dark)  {
    --b-fg: theme('colors.gray.200');
    --b-bg: theme('colors.gray.900');
    --b-light-1: theme('colors.indigo.900');
    --b-light-2: transparent;
    --b-highlight-1: theme('colors.indigo.400');
    --b-highlight-2: theme('colors.indigo.500');
  }

  button {
    color: var(--b-fg);
    border-color: var(--b-fg);
    background-color: var(--b-bg);
  }

  button:hover {
    color: var(--b-highlight-1);
    border-color: var(--b-highlight-1);
  }

  button:hover:active {
    color: var(--b-highlight-2);
    border-color: var(--b-highlight-2);
    background-color: var(--b-light-1);
    --tw-ring-color: var(--b-light-2);
  }

  button.disabled,
  button.disabled:hover,
  button.disabled:hover:active
  {
    color: var(--b-fg);
    border-color: var(--b-fg);
    background-color: var(--b-bg);
    cursor: initial;
    opacity: 0.25;
  }
</style>
