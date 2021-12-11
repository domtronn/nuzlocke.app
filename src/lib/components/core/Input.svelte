<script>
  export let name, value = null, color = '', className = '', placeholder = '', icon, rounded = false
  import Icon from 'svelte-icons-pack'
  name = name || placeholder
</script>

<div>
  <label for={name}>{name}</label>
  <input
    id={name}
    {placeholder}
    type=text
    bind:value={value}
    class:rounded-lg={rounded}
    class:pl-8={!!icon}
    class:pl-3={!icon}
    class='{color} {className}'
    autocomplete=off
  />
  {#if icon}
    <span>
      <Icon src={icon} className='fill-current absolute left-0 top-1/2 -translate-y-1/2 ml-3' />
    </span>
  {/if}
  <slot />
</div>

<style>
  div { position: relative; }

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
    /* @apply  sm:text-xs */
    @apply text-xxs sm:text-xs w-full transition-colors border-2 ring-2 ring-transparent text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none pr-3 h-10;
    background-color: var(--input-bg);
    border-color: theme('colors.gray.200');
  }

  :global(.dark) input {
    @apply text-gray-100 placeholder-gray-500;
    border-color: theme('colors.gray.600');
  }

  :global(.dark) div { @apply text-gray-500 transition }
  :global(.dark) input:hover + span, :global(.dark) input:focus + span { @apply text-gray-100 }
  div { @apply text-gray-400 transition }
  input:hover + span, input:focus + span { @apply text-gray-800 }

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
