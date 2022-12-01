<script>
  export let options, selected, name, className

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { On } from '$icons'
  import { Off } from '$icons'
</script>

{#each options as o, i}
  <label class={className}>
    <input type=radio bind:group={selected} {name} value={i} />
    <span class=on><Icon inline={true} height=1.4em icon={On} class='fill-current ml-0.5 text-indigo-600 dark:text-indigo-500' /></span>
    <span class=off><Icon inline={true} height=1.4em icon={Off} class='fill-current ml-0.5' /></span>
    <small>{o}</small>
  </label>
{/each}

<style>
  label {
    display: flex;
    @apply flex-row-reverse w-24;
    align-items: center;
    position: relative;
    user-select: none;
    cursor: pointer;
  }

  input {
    position: absolute;
    opacity: 100;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  input:checked ~ .on { display: block; }
  input:checked ~ .off { display: none; }
  input:checked ~ small { @apply text-indigo-600  }
  :global(.dark) input:checked ~ small { @apply text-indigo-500 }

  input ~ .off { display: block; }
  input ~ .on { display: none; }


  small { @apply text-xs text-right; }
</style>
