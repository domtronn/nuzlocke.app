<script>
  export let store, id
  import { onMount } from 'svelte'
  import { readdata, patchlocation } from '$lib/store'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Edit } from '$icons'

  let value
  onMount(() => {
    const [data] = readdata()
    const custom = (data?.__custom || [])
    const match = custom.find(i => i.id === id)
    value = match.name
  })

  const oninput = e => {
    const val = e.target.innerText
    store.update(patchlocation({ id, name: val }))
    value = val
  }
</script>

<div
  class:text-gray-500={!value}
  class:text-black={value}
  class:dark:text-gray-50={value}
  class='inline-flex items-center justify-end relative w-auto text-gray-500 border-gray-500 transition cursor-edit'>
  <span
    contenteditable
    on:input={oninput}
    class:sm:hover:border-gray-300={true}
    class:sm:dark:hover:border-gray-600={true}
    class:focus:border-yellow-500={true}
    class:dark:focus:border-yellow-500={true}
    class='flex select-text transition border-2 border-transparent  px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:w-auto text-left outline-none flex-row sm:flex-row-reverse items-center gap-x-2 lg:-ml-6 -mr-1'
  >
    {value}
  </span>
  {#if !value}
  <span class='block sm:hidden absolute left-0 pointer-events-none'>Edit location name</span>
  {/if}
  <Icon
    inline={true}
    size=1.4em
    icon={Edit}
    class='{!value
               ? 'absolute -right-1 top-1 hidden sm:block'
               : 'absolute sm:-left-1 -right-0 top-2 sm:top-1/2 sm:-translate-y-1/2 sm:right-initial translate-x-full sm:-translate-x-full dark:text-gray-500 text-gray-300 hover:text-black'}
               fill-current cursor-edit pointer-events-none transition'
    />

</div>

<style lang="postcss">
  span:focus ~ :global(*) { opacity: 0; }
  @media (min-width:theme('screens.sm')) {
    span { min-width: 1ch; padding-left: 20px; text-align: right; width: fit-content; }
  }

  @media (max-width:theme('screens.sm')) {
    span { min-width: 14ch; user-select: text; }
    span:focus { min-width: 0; }
  }
</style>
