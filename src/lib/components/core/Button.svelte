<script>
  import { createEventDispatcher } from 'svelte'

  export let className = '', rounded = false, disabled = false, tabIndex = 1, solid = false

  const dispatch = createEventDispatcher()
  const onclick = _ => !disabled && dispatch('click')
</script>

<button
  {tabIndex}
  {disabled}
  on:click={onclick}
  class:disabled={disabled}
  class:rounded-lg={rounded}
  class:solid={solid}
  class='border-2 ring-2 ring-transparent px-4 transition-colors h-10 {className}'
>
  <slot />
</button>

<style lang="postcss">
  :root {
    --b-fg: theme('colors.gray.700');
    --b-bg: theme('colors.gray.100');
    --b-light-1: theme('colors.orange.50');
    --b-light-2: theme('colors.orange.300');
    --b-highlight-1: theme('colors.orange.500');
    --b-highlight-2: theme('colors.orange.300');
  }

  :global(.dark)  {
    --b-fg: theme('colors.gray.200');
    --b-bg: theme('colors.gray.900');
    --b-light-1: theme('colors.orange.500');
    --b-light-2: transparent;
    --b-highlight-1: theme('colors.orange.400');
    --b-highlight-2: theme('colors.gray.800');
  }

  :global(.dark) .solid {
    --b-fg: theme('colors.gray.900');
    --b-bg: theme('colors.gray.200');
    --b-light-1: theme('colors.orange.500');
    --b-light-2: transparent;
    --b-highlight-1: theme('colors.orange.400');
    --b-highlight-2: theme('colors.gray.800');
  }

  button {
    color: var(--b-fg);
    border-color: var(--b-fg);
    background-color: var(--b-bg);
  }

  button.solid {
    font-weight: bold;
    color: var(--b-fg);
    border-color: var(--b-bg);
    background-color: var(--b-bg);
  }

  button:hover {
    color: var(--b-highlight-1);
    border-color: var(--b-highlight-1);
  }

  button.solid:hover {
    color: var(--b-fg);
    border-color: var(--b-highlight-1);
    background-color: var(--b-highlight-1);
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
