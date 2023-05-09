<script>
  export let name
  export let rounded = false,
    color = '',
    className = '',
    placeholder = '',
    maxlength = 16
  export let min = -Infinity,
    max = Infinity,
    type = 'text'
  export let value = null,
    icon = null

  import { Icon } from '$c/core'

  name = name || placeholder
</script>

<label for={name}>{name}</label>

{#if type === 'number'}
  <input
    id={name}
    {placeholder}
    {min}
    {max}
    type="number"
    on:input
    bind:value
    class:rounded-lg={rounded}
    class:pl-8={!!icon}
    class:pl-3={!icon}
    class="{color} {className} {$$restProps.class || ''}"
  />
{:else}
  <input
    id={name}
    {placeholder}
    type="text"
    {maxlength}
    on:input
    bind:value
    class:rounded-lg={rounded}
    class:pl-8={!!icon}
    class:pl-3={!icon}
    class="{color} {className} {$$restProps.class || ''}"
    autocomplete="off"
  />
{/if}

{#if icon}
  <span>
    <Icon
      inline={true}
      {icon}
      class="absolute left-0 top-1/2 ml-3 -translate-y-1/2 fill-current"
    />
  </span>
{/if}

<slot />

<style lang="postcss">
  :root {
    --inp-focus: theme('colors.black');
    --inp-focus-2: theme('colors.gray.500');
  }

  :global(.dark) {
    --inp-focus: theme('colors.white');
    --inp-focus-2: theme('colors.gray.200');
  }

  .green {
    --inp-focus: theme('colors.green.400');
    --inp-focus-2: theme('colors.green.200');
  }
  .orange {
    --inp-focus: theme('colors.orange.400');
    --inp-focus-2: theme('colors.orange.200');
  }

  input {
    /* @apply  sm:text-xs */
    @apply h-10 w-full border-2 pr-3 text-xxs text-gray-800 placeholder-gray-400 shadow-sm ring-2 ring-transparent transition-colors focus:outline-none sm:text-xs;
    background-color: var(--input-bg);
    border-color: theme('colors.gray.200');
  }

  :global(.dark) input {
    @apply text-gray-100 placeholder-gray-500;
    border-color: theme('colors.gray.600');
  }

  :global(.dark) span {
    @apply text-gray-500 transition;
  }

  span {
    @apply text-gray-400 transition;
  }

  input:focus + span {
    @apply text-gray-800;
  }

  :global(.dark) input:focus + span {
    @apply text-gray-100;
  }

  @media (hover: hover) {
    input:focus + span {
      @apply text-gray-800;
    }
    :global(.dark) input:hover + span {
      @apply text-gray-100;
    }
    input:hover {
      border-color: var(--inp-focus-2);
    }
  }

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

  input.important\:pr {
    padding-right: 32px !important;
  }

  @media (max-width: theme('screens.sm')) {
    input.sm\:inverted:hover + span,
    input.sm\:inverted:focus + span {
      @apply text-gray-100;
    }

    :global(.dark) input.sm\:inverted:hover + span,
    :global(.dark) input.sm\:inverted:focus + span {
      @apply text-gray-800;
    }

    input.sm\:inverted {
      @apply bg-black text-white;
    }

    :global(.dark) input.sm\:inverted {
      @apply bg-gray-50 text-black;
    }
  }
</style>
