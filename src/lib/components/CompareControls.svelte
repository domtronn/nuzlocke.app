<script>
  export let value, list, pageSize = 5, select = i => i, className = '', title = ''

  import { PIcon } from '$lib/components/core'
  import Icon from 'svelte-icons-pack'
  import Arrow from 'svelte-icons-pack/bi/BiSolidRightArrow'

  import Pip from 'svelte-icons-pack/bs/BsCircleFill'

  import { fade } from 'svelte/transition'
  import { chunk } from '$lib/utils/arr'

  let page = 0
  $: page = 0

  const pages = chunk(list, pageSize)
  const max = pages.length - 1

  const inc = _ => page = Math.min(max, page + 1)
  const dec = _ => page = Math.max(0, page - 1)
</script>

{#if list.length > 1}
  <div class='flex text-white px-2 items-center justify-between'>
    <h2 class='font-medium text-base -mb-5 md:mb-0'>{title}</h2>
    {#if pages.length > 1}
      <div class='flex items-center gap-x-2 translate-y-2.5'>
        {#each Array(pages.length).fill('foo') as p, i}
          <Icon size=0.5rem src={Pip} className='fill-current transform transition {page === i ? 'scale-150' : 'scale-100 opacity-50'}' />
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
  <button disabled={page === 0} class='disabled:opacity-25 block' on:click={dec}>
    <Icon className='fill-current transform rotate-180' src={Arrow} />
  </button>
  <div class='grid -my-2 grid-cols-5 gap-x-2'>
    {#each pages[page] as p, i (p)}
    <div
      in:fade={{ duration: 300, delay: 50 }}
      class:opacity-50={value !== (page * pageSize) + i}
      class:grayscale={value !== (page * pageSize) + i}
      class:scale-150={value === (page * pageSize) + i}
      class='transform transition hover:grayscale-0 hover:scale-150 cursor-pointer'
      on:click={e => value = (page * pageSize) + i}>
      <PIcon name={select(p)} />
    </div>
  {/each}
  </div>
  <button disabled={page === max} class=disabled:opacity-25 on:click={inc}>
    <Icon className=fill-current src={Arrow} />
  </button>
</div>
{/if}

<style>
  button {
    @apply z-50 p-3 text-gray-600 hover:text-orange-600 disabled:hover:text-gray-600 disabled:cursor-default transition
  }

  :global(.dark) button {
    @apply  text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }
</style>
