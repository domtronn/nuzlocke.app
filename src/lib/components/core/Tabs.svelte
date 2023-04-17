<script>
  export let name,
    selected,
    tabs = [],
    className = '',
    labelClassName = '',
    select = (i) => i.val,
    active = 0

  $: selected = select(tabs[active]) || active
</script>

<div
  class="sm:w-initial flex w-full flex-row gap-x-4 overflow-x-scroll {className}"
>
  {#each tabs as tab, i}
    <label
      class:active={active === i}
      class="cursor-pointer text-base transition-colors {labelClassName}"
    >
      <input type="radio" bind:group={active} {name} value={i} />
      <span>{typeof tab === 'string' ? tab : tab.label}</span>
    </label>
  {/each}
</div>

<style lang="postcss">
  div {
    width: calc(100% - theme('spacing.8'));
  }
  @media (min-width: theme('screens.sm')) {
    div {
      width: auto;
    }
  }

  input {
    display: none;
  }
  span {
    white-space: pre;
  }

  label {
    color: theme('colors.gray.500');
    border-bottom: 2px solid transparent;
  }

  label:hover {
    border-bottom-color: theme('colors.gray.500');
  }

  label.active {
    color: theme('colors.gray.900');
    border-bottom-color: theme('colors.gray.900');
  }

  :global(.dark) label {
    color: theme('colors.gray.400');
  }

  :global(.dark) label:hover {
    border-bottom-color: theme('colors.gray.400');
  }

  :global(.dark) label.active {
    color: theme('colors.gray.200');
    border-bottom-color: theme('colors.gray.200');
  }
</style>
