<script>
  export let title,
    src = false,
    name = false,
    disabled = false,
    containerClassName = '',
    className = '',
    color = 'gray',
    rounded = false,
    tabIndex = 1,
    borderless = false

  import { createEventDispatcher } from 'svelte'
  import { Icon, PIcon } from '$c/core'

  const dispatch = createEventDispatcher()
  const onclick = (e) => dispatch('click', e)
</script>

<button
  {tabIndex}
  {disabled}
  aria-label={title}
  {title}
  on:click|stopPropagation={onclick}
  class:borderless={borderless === true}
  class:sm:borderless={borderless === 'sm'}
  class:disabled
  class:rounded-lg={rounded}
  class="group {color} {containerClassName} {$$restProps.class || ''} "
>
  {#if $$slots.icon}
    <slot name="icon" />
  {:else if src}
    <Icon
      class="m-2 fill-current grayscale group-hover:grayscale-0 {className}"
      icon={src}
    />
  {:else if name}
    <PIcon
      className="transition grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 {className}"
      {name}
      type="item"
    />
  {/if}
  <slot />
</button>

<style lang="postcss">
  :root {
    --icb-hover: theme('colors.gray.800');
    --icb-active: theme('colors.gray.900');
    --icb-bg: theme('colors.gray.400');
  }

  :global(.dark) {
    --icb-hover: theme('colors.gray.200');
    --icb-active: theme('colors.gray.100');
    --icb-bg: theme('colors.gray.500');
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

  .yellow {
    --icb-hover: theme('colors.yellow.400');
    --icb-active: theme('colors.yellow.400');
    --icb-bg: theme('colors.yellow.200');
  }

  :global(.dark) .yellow {
    --icb-active: theme('colors.yellow.300');
    --icb-bg: theme('colors.yellow.700');
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

  .sky {
    --icb-hover: theme('colors.sky.400');
    --icb-active: theme('colors.sky.400');
    --icb-bg: theme('colors.sky.200');
  }

  :global(.dark) .sky {
    --icb-active: theme('colors.sky.300');
    --icb-bg: theme('colors.sky.700');
  }

  :global(.dark) button,
  :global(.dark) button.disabled {
    border-color: theme('colors.gray.600');
  }

  button,
  button.disabled {
    @apply flex items-center border-2 shadow-sm ring-2 ring-transparent transition;
    background-color: var(--input-bg);
    border-color: theme('colors.gray.200');
    color: theme('colors.gray.400');
  }

  button.borderless,
  button.disabled.borderless {
    @apply border-0 bg-transparent shadow-none;
  }

  button.sm\:borderless,
  button.disabled.sm\:borderless {
    @apply border-0 bg-transparent shadow-none outline-none;
  }

  @media (min-width: theme('screens.sm')) {
    button.sm\:borderless,
    button.disabled.sm\:borderless {
      @apply border-2 shadow-sm;
      background-color: var(--input-bg);
    }
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
