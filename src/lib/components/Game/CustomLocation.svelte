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
    class:hover:border-black={value}
    class:dark:hover:border-gray-50={value}
    class='flex select-text transition border-b border-transparent hover:border-gray-500 focus:border-black dark:focus:border-gray-50 dark:focus:text-gray-50 focus:text-black md:w-auto focus:w-auto text-left sm:text-right outline-none flex-row sm:flex-row-reverse items-center gap-x-2 lg:-ml-6 -mr-1'
  >
    {value}
  </span>
  <Icon
    inline={true}
    size=1.4em
    icon={Edit}
    className='{!value ? 'absolute left-0 sm:right-0 sm:-translate-x-full top-0' : 'absolute -right-2 sm:right-initial translate-x-full sm:-translate-x-full sm:-left-8 dark:text-gray-500 text-gray-300 hover:text-black'} fill-current cursor-edit pointer-events-none transition'
    />

</div>

<style>
  span:focus ~ :global(*) { opacity: 0; }
  @media (max-width:theme('screens.sm')) {
    span { min-width: 480px; user-select: text; }
    span:focus { min-width: 0; }
  }
</style>
