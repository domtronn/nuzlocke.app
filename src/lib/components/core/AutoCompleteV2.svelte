<script>
  export let id, placeholder, name
  export let itemF = (_) => [],
    labelF = (i) => i?.label || i

  export let delay = 50,
    max = 20,
    inset = null

  export let debug = false

  import { PIcon, Icon } from '$c/core'
  import { Chevron } from '$icons'

  import { debouncePromise, clickOutside } from './AutoCompleteV2/utils.ts'
  import { pluralise, htmlLabel } from './AutoCompleteV2/string.ts'
  import { matchSorter } from 'match-sorter'

  export let selected, search
  let inputVal,
    optionsP = Promise.resolve({})

  const debouncedItemF = debouncePromise(itemF, search?.length ? delay : 0)

  function filterF(items, search) {
    const filteredItems = matchSorter(items, search ?? '', {
      keys: [(item) => labelF(item)]
    })

    const slicedItems = filteredItems.slice(0, max)
    return {
      options: slicedItems,
      filtered: items.length - filteredItems.length,
      hidden: filteredItems.length - slicedItems.length
    }
  }

  let ariaExpanded = false
  async function focus() {
    if (!selected) listElRef = -1
    ariaExpanded = true
    optionsP = filterF(await debouncedItemF(), search)
  }

  async function change() {
    search = inputVal
    focus()
  }

  const select = (data) =>
    function boundSelect() {
      selected = data
      hideMenu()
    }

  function onSelectedChange() {
    inputVal = selected ? labelF(selected) : null
  }

  function hideMenu() {
    if (!selected) listElRef = -1
    ariaExpanded = true
    search = null
    inputVal = selected ? labelF(selected) : null
    optionsP = Promise.resolve({})
  }

  $: selected, onSelectedChange()

  const acId = `autocomplete-${id}`

  let inputEl,
    listEl,
    listElRef = -1
  function handleKeyDown(e) {
    switch (true) {
      case e.key === 'Escape':
        hideMenu()
        break

      case e.key === 'Tab' && !e.shiftKey:
      case e.key === 'ArrowDown':
        e.preventDefault()
        listElRef = Math.min(listElRef + 1, listEl.childElementCount - 1)
        listEl.childNodes[listElRef].focus()
        break

      case e.key === 'Tab' && e.shiftKey:
      case e.key === 'ArrowUp':
        e.preventDefault()
        listElRef = Math.max(listElRef - 1, -1)
        if (listElRef === -1) inputEl.focus()
        else listEl.childNodes[listElRef].focus()
        break
    }
  }

  const handleInnerKeyDown = (data) =>
    function boundHandleInnerKeyDown(e) {
      if (e.key === 'Enter') {
        selected = data
        hideMenu()
      }

      if (e.key === 'Backspace') {
        inputEl.value = (inputEl.value ?? '').slice(0, -1)
        inputEl.dispatchEvent(new Event('input'))
        inputEl.focus()
      }

      if (/^[a-z0-9]$/i.test(e.key)) {
        inputEl.value = (inputEl.value ?? '') + e.key
        inputEl.dispatchEvent(new Event('input'))
        inputEl.focus()
      }
    }

  $: style = inset
    ? `--auc-inset: ${typeof inset === 'string' ? inset : '3.2rem'}`
    : ''
</script>

{#if debug}
  <pre>
    listElRef: {listElRef}
  </pre>
{/if}

<div
  {style}
  class="autocomplete {$$restProps.class || ''}"
  use:clickOutside
  on:clickOutside={hideMenu}
  on:keydown={handleKeyDown}
>
  <slot
    iconClass="pointer-events-none absolute z-40 -left-2 top-1/2 -translate-y-1/2"
    name="icon"
    {selected}
  />
  <Icon
    inline
    size="1em"
    icon={Chevron}
    class="pointer-events-none absolute right-1 top-1/2 z-10 w-6 -translate-y-1/2 rotate-180 transform border-r fill-current text-gray-200 dark:border-gray-500 dark:text-gray-500"
  />

  <input
    {name}
    {placeholder}
    bind:value={inputVal}
    bind:this={inputEl}
    on:change
    on:input={change}
    on:focus={focus}
    on:click={focus}
    type="text"
    autocapitalize="none"
    autocomplete="off"
    role="combobox"
    aria-owns="autocomplete-options--destination"
    aria-autocomplete="list"
    aria-controls={acId}
    aria-expanded={ariaExpanded}
  />

  {#await optionsP then { options, hidden, filtered }}
    {#if options}
      <div id={acId} style="--mw: {inputEl?.clientWidth}px;" class="results">
        {#if options.length}
          <ul bind:this={listEl}>
            {#each options as option}
              <li
                role="option"
                tabindex="-1"
                aria-selected={option == selected}
                on:click={select(option)}
                on:keydown={handleInnerKeyDown(option)}
              >
                {#if $$slots.option}
                  <slot
                    name="option"
                    {option}
                    label={htmlLabel(labelF(option), search)}
                  />
                {:else}
                  {@html htmlLabel(labelF(option), search)}
                {/if}
              </li>
            {/each}
          </ul>

          {#if hidden > 0}
            <small aria-live="polite" role="status">
              ... {hidden}
              {pluralise('items', hidden)} not shown
            </small>
          {/if}
        {:else if $$slots.empty}
          <slot name="empty" />
        {:else}
          <small>
            <PIcon
              className="grayscale transform scale-75 -mb-2 -mt-3 -mr-4 -ml-5"
              name="unown-question"
            />
            No results found
          </small>
        {/if}
      </div>
    {/if}
  {/await}
</div>

<style>
  :root {
    --auc-inset: theme('spacing.3');
  }

  .autocomplete {
    position: relative;
  }

  input {
    /* @apply  sm:text-xs */
    @apply h-10 w-full rounded-lg border-2 pr-3 text-xxs text-gray-800 placeholder-gray-400 shadow-sm ring-2 ring-transparent transition-colors focus:outline-none sm:text-xs;
    padding-left: var(--auc-inset);
    background-color: var(--input-bg);
    border-color: theme('colors.gray.200');
  }

  :global(.dark) input {
    @apply text-gray-100 placeholder-gray-500;
    border-color: theme('colors.gray.600');
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

  :global(.dark) .results {
    @apply border-gray-700 bg-gray-800;
  }

  .results {
    @apply rounded-lg border-2 border-gray-200 bg-white;

    width: max-content;
    min-width: var(--mw);
    padding: 0;
    margin: 0;
    position: absolute;
    z-index: 4000;
    bottom: -8px;
    transform: translateY(100%);

    max-height: 420px;
    overflow-y: scroll;
  }

  small {
    @apply text-gray-400;
  }

  ul li,
  small {
    @apply border-none px-2 text-xs outline-none;
  }

  ul:not(:hover) li:focus,
  ul li:hover {
    @apply cursor-pointer bg-gray-400 text-gray-900;
  }

  :global(.dark) ul:not(:hover) li:focus,
  :global(.dark) ul li:hover {
    @apply cursor-pointer bg-gray-200 text-gray-900;
  }

  ul:hover li:not(:hover):focus {
    @apply bg-gray-400 text-gray-900;
  }

  ul {
    @apply m-0 p-0;
    list-style: none;
  }

  li[aria-selected='true'] {
    @apply !bg-gray-600 !text-white;
  }
  :global(.dark) li[aria-selected='true'] {
    @apply !bg-gray-50 !text-gray-900;
  }
</style>
