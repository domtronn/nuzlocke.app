<script>
  export let id, state = false
</script>

<label for={id}>
  <slot />
</label>

<label class=switch>
  <input {id} bind:checked={state} type=checkbox />
  <span />
</label>

<style lang="postcss">
  :root {
    --bg-on: theme('colors.white');
    --fg-on: theme('colors.orange.600');
    --bg-off: theme('colors.white');
    --fg-off: theme('colors.gray.500');
  }

  :global(.dark) {
    --bg-on: theme('colors.gray.800');
    --fg-on: theme('colors.orange.500');
    --bg-off: theme('colors.gray.800');
    --fg-off: theme('colors.gray.500');
  }

  .switch {
    flex-shrink: 0;
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-off);
    border-radius: 80px;
    border: 2px solid var(--fg-off);
    transition: 100ms;
  }



  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: var(--fg);
    background-color: var(--fg-off);
    border-radius: 50%;
    transition: 100ms;
  }

  input:checked + span {
    border-color: var(--fg-on);
    background-color: var(--bg-on);
  }

  input:focus + span {
    box-shadow: 0 0 1px var(--bg-on);
  }

  input:checked + span:before {
    background-color: var(--fg-on);
    transform: translateX(20px);
  }
</style>
