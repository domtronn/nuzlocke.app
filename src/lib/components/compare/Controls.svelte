<script>
  export let value,
    list,
    pageSize = 5,
    select = (i) => i,
    className = '',
    title = '',
    controls = true

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

{#if list.length > 1}
  <div class="title mx-auto -mb-5 w-fit px-2 text-white">
    <h2 class="text-base font-medium md:mb-0">{title}</h2>
  </div>

  <div
    class="team mx-auto mt-2 -mb-2 w-fit justify-center rounded-xl bg-white dark:bg-gray-900 {className} {$$restProps.class ||
      ''}"
    class:justify-end={page === 0}
    class:justify-start={page === max}
    class:justify-between={page < max && page > 0}
  >
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
  </div>
{/if}

<style lang="postcss">
  button.page {
    @apply z-50 p-3 text-gray-600 transition hover:text-orange-600 disabled:cursor-default disabled:hover:text-gray-600;
  }

  :global(.dark) button.page {
    @apply text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }

  .title {
    @apply block md:hidden;
  }

  @media (min-width: theme('screens.md')) {
    button {
      @apply -rotate-90 transform;
    }

    button::before {
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
