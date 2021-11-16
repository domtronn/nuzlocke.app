<script>
  import AutoComplete from 'simple-svelte-autocomplete'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Spinner from 'svelte-icons-pack/cg/CgSpinner'

  export let items, placeholder, inset = false, color = '', label = 'label', className = '', rounded = false, fetch
  export let selected = null, style = ''

  const iconclass = 'absolute z-40 -left-2 top-1/2 -translate-y-1/2'
  const roundedClass = rounded ? 'rounded-lg' : ''
  const labelProps = {
    ...(typeof label === 'string' ? { labelFieldName: label }: {}),
    ...(typeof label === 'function' ? { labelFunction: label }: {})
  }

  $: style = inset ? `--auc-inset: ${typeof inset === 'string' ? inset : '3.2rem'}` : ''
</script>

<div {style} class='relative inline-block {className}'>
  <slot iconClass='pointer-events-none absolute z-40 -left-2 top-1/2 -translate-y-1/2' {selected} name=icon />

  <AutoComplete
    hideArrow

    bind:selectedItem={selected}

    {items}
    {placeholder}
    {...labelProps}

    delay={fetch ? 75 : 0}
    searchFunction={fetch}

    className='{color} w-full text-xxs md:text-xs'
    dropdownClassName='shadow-lg {roundedClass}'
    inputClassName='transition-colors border-2 ring-2 ring-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 shadow-sm text-xxs focus:outline-none md:text-base px-3 {roundedClass}'
  >

    <svelte:fragment slot=item let:item={_item} let:label={_label}>
      {#if $$slots.item}
        <slot name=item item={_item} label={_label} />
      {:else}
        {@html _label}
      {/if}
    </svelte:fragment>

    <span slot=no-results let:noResultsText={noResultsText} class='inline-flex items-center h-6 text-sm'>
      <PIcon className='grayscale transform scale-75 -my-4 -mr-4 -ml-5' name='unown-question' />
      {noResultsText}
    </span>

    <span slot=loading let:loadingText={loadingText} class='inline-flex items-center h-6 text-sm text-gray-600'>
      <Icon src={Spinner} className='fill-current animate-spin mr-2' />
      {loadingText}
    </span>

  </AutoComplete>
</div>

<style>
  :root {
    --auc-inset: theme('spacing.3');

    --auc-fg: theme('colors.gray.800');
    --auc-bg: theme('colors.white');

    --auc-focus: theme('colors.black');
    --auc-focus-2: theme('colors.gray.500');
    --auc-focus-fg: theme('colors.gray.100');
  }

  :global(.dark) {
    --auc-fg: theme('colors.gray.100');
    --auc-bg: theme('colors.gray.800');
    --auc-focus: theme('colors.white');
    --auc-focus-fg: theme('colors.gray.900');
    --auc-focus-2: theme('colors.gray.200');
  }

  :global(.autocomplete.green),
  :global(.autocomplete.orange)
  {
    --auc-focus-fg: theme('colors.gray.100');
  }

  :global(.autocomplete.green) {
    --auc-focus: theme('colors.green.400');
    --auc-focus-2: theme('colors.green.200');
  }

  :global(.autocomplete) {
    min-width: auto !important;
  }

  :global(.pkm-unown-question) {
    width: 11px;
    height: 21px;
    background-position: -483px -44px;
  }

  :global(input.autocomplete-input) {
    padding: 0 !important;
    padding-left: var(--auc-inset) !important;
    background-color: theme('colors.white');
    border-color: theme('colors.gray.200');
  }

  :global(.autocomplete) {
    height: calc(100% + 4px) !important;
    max-height: 40px;
  }

  :global(input.autocomplete-input),
  :global(input.autocomplete) {
    font-size: theme('fontSize.xxs') !important;
    height: theme('spacing.10') !important;
  }

  @media (min-width: theme('screens.sm')) {
    :global(input.autocomplete-input),
    :global(input.autocomplete)
    {
      font-size: theme('fontSize.xs') !important;
      height: theme('spacing.10') !important;
    }
  }

  :global(.dark input.autocomplete-input) {
    background-color: theme('colors.gray.700');
    border-color: theme('colors.gray.600');
  }

  :global(input.autocomplete-input:hover) { border-color: var(--auc-focus-2); }
  :global(input.autocomplete-input:focus) {
    border-color: var(--auc-focus);
    --tw-ring-color: var(--auc-focus-2);
  }

  /* Autocomplete list */
  :global(div.autocomplete-list) {
    padding: 0 !important;
    margin-top: theme('spacing.2');
    border-width: theme('borderWidth.2') !important;
    border-color: theme('colors.gray.200') !important;
    background-color: var(--auc-bg) !important;
  }

  :global(.dark div.autocomplete-list) {
    border-color: theme('colors.gray.700') !important;
    width: calc(100% + theme('spacing.2')) !important;
  }

  :global(div.autocomplete-list-item) {
    color: var(--auc-fg) !important;
  }

  :global(div.autocomplete-list-item.confirmed),
  :global(div.autocomplete-list-item.selected.confirmed) {
    background-color: var(--auc-focus) !important;
    color: var(--auc-focus-fg) !important;
  }

  :global(div.autocomplete-list-item:hover),
  :global(div.autocomplete-list-item.selected)
  {
    color: var(--auc-focus-fg) !important;
    background-color: var(--auc-focus-2) !important;
  }
</style>
