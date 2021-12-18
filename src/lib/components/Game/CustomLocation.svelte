<script>
  export let store, id, value
  import { patchlocation } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import Edit from 'svelte-icons-pack/ai/AiOutlineEdit'

  $: store.update(patchlocation({id, name: value}))
</script>

<div
  class:text-gray-500={!value}
  class:text-black={value}
  class:dark:text-gray-50={value}
  class='inline-flex items-center justify-end relative w-auto text-gray-500 border-gray-500 transition cursor-edit'>
  <span
    bind:textContent={value}
    contenteditable
    class:border-gray-500={!value}
    class:border-transparent={value}
    class:hover:border-black={value}
    class:dark:border-gray-50={!value}
    class:dark:hover:border-gray-50={value}
    class='flex transition border-b hover:border-gray-500 focus:border-black dark:focus:border-gray-50 dark:focus:text-gray-50 focus:text-black focus:w-auto text-right outline-none flex-row-reverse items-center gap-x-2 lg:-ml-6 -mr-1'
  />
  <Icon
    size=1.6em
    src={Edit}
    className='{!value ? 'absolute right-0 translate-x-full sm:translate-x-0 top-0' : 'absolute -right-2 sm:right-initial translate-x-full sm:-translate-x-full sm:-left-8 dark:text-gray-500 text-gray-300 hover:text-black'} fill-current cursor-edit pointer-events-none transition sm:-mb-1'
  />
</div>

<style>
  span:focus ~ :global(*) { opacity: 0; }
</style>
