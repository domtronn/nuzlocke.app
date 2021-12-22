<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { support, consent } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import Coffee from 'svelte-icons-pack/si/SiBuymeacoffee'

  
  const SUPPORTED = 'supported'
  let mounted
  onMount(() => {
    if ($support === SUPPORTED || !$consent) return
    
    const [lastday, count, s] = ($support || '').split('|')
    const day = Math.floor(new Date() / (1000 * 60 * 60 * 24)) // 1 day
    if (lastday < day) {
      $support = `${day}|${count ? +count + 1 : 1}|${s || ''}`
    }
    
    mounted = +count >= 7 && (+count - 7) % 3 === 0
  })
</script>

{#if mounted && $consent && $support !== SUPPORTED}
  <div transition:slide={{ y: 200, duration: 500, delay:200 }} class='z-50 w-auto fixed rounded-xl right-0 bottom-0 m-2 md:m-6 px-4 py-3 dark:text-gray-800 font-medium dark:bg-white bg-gray-100 shadow-lg'>
    <div class='container mx-auto inline-flex text-xs text-right md:text-sm lg:text-base items-center justify-between'>
      <span class='leading-5'>
        Hope you're enjoying the <b>Nuzlocke tracker</b>!
        <br />Would you consider supporting me to make it awesome?
      </span>
      <a href="https://www.buymeacoffee.com/nuzlocketracker" target="_blank">
        <button
          on:click={support.set.bind({}, SUPPORTED)}
          class='umami--click--support ml-4 font-sans transition text-xs text-pink-50 hover:ring-pink-200 hover:active:ring-pink-500 hover:active:bg-pink-500 ring-white ring-2 rounded-lg bg-pink-400 px-4 py-2'
          >
          <Icon src={Coffee} size='1.2rem' className='hidden md:inline fill-current mr-px -ml-1' />
          Buy me a Coffee
        </button>
      </a>
      <button
        on:click={support.set.bind({}, SUPPORTED)}
        class='umami--click--no-support ml-2 font-sans transition text-xs text-gray-700 hover:ring-gray-100 hover:active:ring-gray-300 hover:active:bg-gray-300 ring-white ring-2 rounded-lg bg-gray-200 px-4 py-2'
      >
        <Icon src={Coffee} size='1.2rem' className='w-0 hidden md:inline fill-current mr-px -ml-1' />
        No thanks
      </button>
    </div>
  </div>
{/if}
