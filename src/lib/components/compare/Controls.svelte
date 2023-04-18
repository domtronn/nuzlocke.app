<script>
  export let value,
    list,
    pageSize = 5,
    select = (i) => i,
    className = '',
    title = '',
    showcontrols = false,
    showtitle = false

  import { createEventDispatcher } from 'svelte'
  import { PIcon, Icon } from '$c/core'
  import { Pip, Arrow } from '$icons'

  import { fade } from 'svelte/transition'
  import { chunk } from '$lib/utils/arr'

  const dispatch = createEventDispatcher()

  let page = 0
  $: page = 0

  const pages = chunk(list, pageSize)
  const max = pages.length - 1

  const inc = (_) => (page = Math.min(max, page + 1))
  const dec = (_) => (page = Math.max(0, page - 1))
  const set = (i) => (_) => (page = i)
</script>

{#if list.length > 0}
  <div
    class:md:hidden={!showtitle}
    class:justify-between={$$slots.default}
    class:justify-center={!$$slots.default}
    class=" mx-auto -mb-5 inline-flex w-full px-2 text-white md:px-16"
  >
    <h2 class="text-base font-medium md:mb-0">{title}</h2>
    <slot />
  </div>

  <div
    class="team mx-auto mt-2 -mb-2 inline-flex w-fit justify-center rounded-xl bg-white dark:bg-gray-900 {className} {$$restProps.class ||
      ''}"
    class:justify-end={page === 0}
    class:justify-start={page === max}
    class:justify-between={page < max && page > 0}
  >
    {#if showcontrols}
      <button
        title="Previous page"
        class="page block disabled:opacity-25"
        disabled={page === 0}
        on:click={dec}
      >
        <Icon
          inline={true}
          class="rotate-180 transform fill-current"
          icon={Arrow}
        />
      </button>
    {/if}

    {#each pages[page] as p, i (p)}
      {@const selected = value === page * pageSize + i}
      <button
        in:fade={{ duration: 300, delay: 50 }}
        class:opacity-50={!selected}
        class:grayscale={!selected}
        class:scale-125={selected}
        class:selected
        class="-mx-2 -my-2 origin-center transform cursor-pointer transition hover:scale-125 hover:opacity-100 hover:grayscale-0"
        on:click={(e) => {
          value = page * pageSize + i
          dispatch('select')
        }}
      >
        <PIcon name={select(p)} />
      </button>
    {/each}

    {#if showcontrols}
      <button
        title="Next page"
        class="page disabled:opacity-25"
        disabled={page === max}
        on:click={inc}
      >
        <Icon inline={true} class="fill-current" icon={Arrow} />
      </button>
    {/if}
  </div>

  {#if pages.length > 1}
    <div class="mt-1 flex justify-center gap-x-4 text-gray-900 dark:text-white">
      {#each Array(pages.length) as p, i}
        <button title="Page {i + 1}" on:click={set(i)}>
          <Icon
            inline={true}
            height="0.5rem"
            icon={Pip}
            class="transform fill-current transition {page === i
              ? 'scale-150'
              : 'scale-100 opacity-50'}"
          />
        </button>
      {/each}
    </div>
  {/if}
{/if}

<style lang="postcss">
  button.page {
    @apply z-50 p-3 text-gray-600 transition hover:text-orange-600 disabled:cursor-default disabled:hover:text-gray-600;
  }

  :global(.dark) button.page {
    @apply text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }

  @media (min-width: theme('screens.md')) {
    .nohighlight ~ div button::before {
      display: none;
    }

    :not(.nohighlight) button {
      @apply -rotate-90 transform;
    }

    :not(.nohighlight) button::before {
      content: '';
      position: absolute;
      @apply top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-50 shadow-lg;
    }

    button.selected::before {
      @apply opacity-100;
    }

    :global(.dark) button.selected::before {
      @apply bg-gray-500;
    }
    :global(.dark) button::before {
      @apply bg-gray-600;
    }
  }
</style>
