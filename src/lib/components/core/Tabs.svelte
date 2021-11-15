<script>
  export let name, tabs = [], className = ''

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const onclick = value => _ => dispatch('change', { value })

  $: active = 0
</script>

<ul class='flex flex-row gap-x-4 {className}'>
  {#each tabs as tab, i}
    <label class:active={active === i} class='text-base cursor-pointer transition-colors'>
      <input type=radio bind:group={active} name={name} value={i} />
      <span on:click={onclick(tab)}>{tab.label}</span>
    </label>
  {/each}
</ul>

<style>
  input { display: none; }

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
