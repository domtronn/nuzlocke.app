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
  <div class="flex items-center justify-between px-2 text-white">
    <h2 class="-mb-5 text-base font-medium md:mb-0">{title}</h2>
    {#if pages.length > 1}
      <div class="flex translate-y-2.5 items-center sm:translate-y-0.5">
        {#each Array(pages.length).fill('foo') as p, i}
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
  </div>

  <div
    class="my-2 flex rounded-xl bg-white dark:bg-gray-900 {className} {$$restProps.class ||
      ''}"
    class:justify-end={page === 0}
    class:justify-start={page === max}
    class:justify-between={page < max && page > 0}
  >
    {#if controls}
      <button
        title="Previous page"
        disabled={page === 0}
        class="page block disabled:opacity-25"
        on:click={dec}
      >
        <Icon
          inline={true}
          class="rotate-180 transform fill-current"
          icon={Arrow}
        />
      </button>
    {/if}

    <div
      class="-my-2 mx-auto grid overflow-hidden"
      style="grid-template-columns: repeat({pageSize}, minmax(0, 1fr));"
    >
      {#each pages[page] as p, i (p)}
        <button
          in:fade={{ duration: 300, delay: 50 }}
          class:opacity-50={value !== page * pageSize + i}
          class:grayscale={value !== page * pageSize + i}
          class:scale-125={value === page * pageSize + i}
          class="-mx-2 origin-center transform cursor-pointer transition hover:scale-125 hover:opacity-100 hover:grayscale-0"
          on:click={(e) => {
            value = page * pageSize + i
            dispatch('select')
          }}
        >
          <PIcon name={select(p)} />
        </button>
      {/each}
    </div>

    {#if controls}
      <button
        title="Next page"
        class:hidden={!controls}
        disabled={page === max}
        class="page disabled:opacity-25"
        on:click={inc}
      >
        <Icon inline={true} class="fill-current" icon={Arrow} />
      </button>
    {/if}
  </div>
{/if}

<style lang="postcss">
  button.page {
    @apply z-50 p-3 text-gray-600 transition hover:text-orange-600 disabled:cursor-default disabled:hover:text-gray-600;
  }

  :global(.dark) button.page {
    @apply text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }
</style>
