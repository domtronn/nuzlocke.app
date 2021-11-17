<script>
  export let name, value = null, color = '', className = '', placeholder = '', rounded = false
  name = name || placeholder
</script>

<label for={name}>{name}</label>
<input
  id={name}
  {placeholder}
  type=text
  bind:value={value}
  class:rounded-lg={rounded}
  class='text-xxs sm:text-xs w-full transition-colors border-2 ring-2 ring-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none px-3 h-10 {color} {className}'
/>

<style>
  :root {
    --inp-focus: theme('colors.black');
    --inp-focus-2: theme('colors.gray.500');
  }

  :global(.dark) {
    --inp-focus: theme('colors.white');
    --inp-focus-2: theme('colors.gray.200');
  }

  .green { --inp-focus: theme('colors.green.400'); --inp-focus-2: theme('colors.green.200'); }
  .orange { --inp-focus: theme('colors.orange.400'); --inp-focus-2: theme('colors.orange.200'); }

  input {
    background-color: var(--input-bg);
    border-color: theme('colors.gray.200');
  }

  :global(.dark) input {
    border-color: theme('colors.gray.600');
  }

  input:hover { border-color: var(--inp-focus-2); }
  input:focus {
    border-color: var(--inp-focus);
    --tw-ring-color: var(--inp-focus-2);
  }

  label {
    border: 0;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

</style>
