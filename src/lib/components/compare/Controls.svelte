<script>
  export let value, list, pageSize = 5, select = i => i, className = '', title = '', controls = true

  import { createEventDispatcher } from 'svelte'
  import { PIcon, Icon } from '$c/core'
  import { Pip, Arrow } from '$icons'

  import { fade } from 'svelte/transition'
  import { chunk } from '$lib/utils/arr'

  const dispatch  = createEventDispatcher()

  let page = 0
  $: page = 0

  const pages = chunk(list, pageSize)
  const max = pages.length - 1

  const inc = _ => page = Math.min(max, page + 1)
  const dec = _ => page = Math.max(0, page - 1)
  const set = i => _ => page = i
</script>

{#if list.length > 1}
  <div class='flex text-white px-2 items-center justify-between'>
    <h2 class='font-medium text-base -mb-5 md:mb-0'>{title}</h2>
    {#if pages.length > 1}
      <div class='flex items-center gap-x-2 translate-y-2.5 sm:translate-y-0.5 '>
        {#each Array(pages.length).fill('foo') as p, i}
          <button
            title='Page {i + 1}'
            on:click={set(i)}
          >
            <Icon inline={true} height=0.5rem icon={Pip} class='fill-current transform transition {page === i ? 'scale-150' : 'scale-100 opacity-50'}' />
          </button>
        {/each}
      </div>
    {/if}
  </div>

<div
  class='bg-white dark:bg-gray-900 my-2 rounded-xl flex {className}'
  class:justify-end={page === 0}
  class:justify-start={page === max}
  class:justify-between={page < max && page > 0}
>
  <button title='Previous page' class:hidden={!controls} disabled={page === 0} class='page disabled:opacity-25 block' on:click={dec}>
    <Icon inline={true} class='fill-current transform rotate-180' icon={Arrow} />
  </button>

  <div
    class='grid -my-2 mx-auto overflow-hidden'
    style='grid-template-columns: repeat({pageSize}, minmax(0, 1fr));'>
    {#each pages[page] as p, i (p)}
      <button
        in:fade={{ duration: 300, delay: 50 }}
        class:opacity-50={value !== (page * pageSize) + i}
        class:grayscale={value !== (page * pageSize) + i}
        class:scale-150={value === (page * pageSize) + i}
        class='transform transition hover:grayscale-0 hover:opacity-100 hover:scale-150 origin-center cursor-pointer'
        on:click={e => {
          value = (page * pageSize) + i
          dispatch('select')
        }}>
        <PIcon name={select(p)} />
      </button>
    {/each}
  </div>

  <button title='Next page' class:hidden={!controls} disabled={page === max} class='page disabled:opacity-25' on:click={inc}>
    <Icon inline={true} class=fill-current icon={Arrow} />
  </button>
</div>
{/if}

<style lang="postcss">
  button.page {
    @apply z-50 p-3 text-gray-600 hover:text-orange-600 disabled:hover:text-gray-600 disabled:cursor-default transition
  }

  :global(.dark) button.page {
    @apply  text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }
</style>
