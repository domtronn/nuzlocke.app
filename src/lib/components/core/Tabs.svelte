<script>
  export let name, selected, tabs = [], className = '', select = i => i.val

  $: active = 0
  $: selected = select(tabs[active]) || active
</script>

<div class='flex flex-row gap-x-4 sm:w-initial overflow-x-scroll {className}'>
  {#each tabs as tab, i}
    <label class:active={active === i} class='text-base cursor-pointer transition-colors umami--click--{name}-{i}'>
      <input type=radio bind:group={active} name={name} value={i} />
      <span>{typeof tab === 'string' ? tab : tab.label}</span>
    </label>
  {/each}
</div>

<style>
  div { width: calc(100vw - theme('spacing.8')); }
  @media (min-width: theme('screens.sm')) {
    div { width: auto; }
  }

  input { display: none; }
  span { white-space: pre; }

  label {
    color: theme('colors.gray.500');
    border-bottom: 2px solid transparent;
  }

  label:hover { border-bottom-color: theme('colors.gray.500'); }

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
