<script>
  export let options, selected, name, className

  import Icon from 'svelte-icons-pack'
  import On from 'svelte-icons-pack/cg/CgRadioChecked'
  import Off from 'svelte-icons-pack/cg/CgRadioCheck'
</script>

{#each options as o, i}
  <label class={className}>
    <input type=radio bind:group={selected} {name} value={i} />
    <span class=on><Icon size=1.4em src={On} className='fill-current ml-0.5 text-indigo-600 dark:text-indigo-500' /></span>
    <span class=off><Icon size=1.4em src={Off} className='fill-current ml-0.5' /></span>
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
