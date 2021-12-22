<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { consent } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import Cookie from 'svelte-icons-pack/bi/BiSolidCookie'
  
  let mounted
  onMount(() => mounted = true)
</script>

{#if mounted && !$consent}
  <div style='z-index:9999999999' transition:slide={{ y: 200, duration: 500, delay:200 }} class='z-50 w-auto fixed rounded-xl right-0 bottom-0 m-2 md:m-6 px-4 py-3 dark:text-gray-800 font-medium dark:bg-white bg-gray-100 shadow-lg'>
    <div class='container mx-auto inline-flex text-xs md:text-sm lg:text-base items-center justify-between'>
      <span>
        This website uses <a rel="noreferrer" target="_blank" class='underline hover:text-indigo-800' href="https://developer.mozilla.org/en-US/docs/bWeb/API/Window/localStorage">Cookies</a> to save your games and Pokémon
      </span>
      <button
        on:click={consent.set.bind({}, true)}
        class='ml-6 font-sans transition text-xs text-white hover:ring-indigo-400 hover:active:ring-indigo-800 hover:active:bg-indigo-800 ring-white ring-2 rounded-lg bg-indigo-700 px-4 py-2'
      >
        <Icon src={Cookie} size='1.2rem' className='hidden md:inline fill-current mr-px -ml-1' />
        Okay
      </button>
    </div>
  </div>
{/if}
