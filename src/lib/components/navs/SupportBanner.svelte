<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { support, consent, readdata } from '$lib/store'
  import { NuzlockeGroups } from '$lib/data/states'
  import { random } from '$lib/utils/arr'

  import { PIcon } from '$lib/components/core'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Coffee } from '$icons'
  
  const SUPPORTED = 'supported'
  let mounted, pokemon
  onMount(() => {
    const [data] = readdata()
    pokemon = random(
      Object
        .values(data || [])
        .filter(i => !!i.nickname && i.status && NuzlockeGroups.Available.includes(i.status))
    )

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
  <div style='z-index:9999999' transition:slide={{ y: 200, duration: 500, delay:200 }} class='z-50 w-auto fixed rounded-xl right-0 bottom-0 m-2 md:m-6 px-4 py-3 dark:text-gray-800 font-medium dark:bg-white bg-gray-100 shadow-lg'>
    <div class='container mx-auto inline-flex text-xs text-right md:text-sm lg:text-base items-center justify-between mr-4'>
      <span class='leading-4 sm:leading-5'>
        Hey <span role=img>👋</span> I hope you're enjoying the <b>Nuzlocke tracker</b>!
        <br class='hidden sm:block' />Would you consider supporting me to make it awesome?
        <br />
        {#if pokemon}
          I know <b>{pokemon.nickname}</b> would really appreciate it
        <PIcon name={pokemon.pokemon} className='-m-5 -ml-5 shake transform scale-150 -mr-14 -mt-10 top-3 sm:bottom-auto sm:right-auto right-24 absolute sm:relative' />
        {/if}
      </span>
      <div class='flex flex-row-reverse sm:flex-row'>
        <a href="https://www.buymeacoffee.com/nuzlocketracker" target="_blank">
          <button
            title='Open support link'
            on:click={support.set.bind({}, SUPPORTED)}
            class='umami--click--support ml-2 sm:ml-4 font-sans transition text-xs text-pink-50 hover:ring-pink-200 hover:active:ring-pink-500 hover:active:bg-pink-500 ring-transparent ring-2 rounded-lg bg-pink-400 px-4 py-4 sm:py-2'
            >
            <Icon inline={true} icon={Coffee} height='1.2rem' class='hidden md:inline fill-current mr-px -ml-1' />
            <span class='hidden sm:inline-block'>Buy me a Coffee</span>
            <span class='sm:hidden'>Okay</span>
          </button>
        </a>
        <button
          title='Close support modal'
          on:click={support.set.bind({}, SUPPORTED)}
          class='umami--click--no-support ml-2 font-sans transition text-xs text-gray-700 hover:ring-gray-100 hover:active:ring-gray-300 hover:active:bg-gray-300 ring-transparent ring-2 rounded-lg bg-gray-200 px-4 py-4 sm:py-2'
          >
          <Icon inline={true} icon={Coffee} height='1.2rem' class='w-0 hidden md:inline fill-current mr-px -ml-1' />
          <span class='hidden sm:inline-block'>No thanks</span>
          <span class='sm:hidden'>No</span>
        </button>
      </div>
    </div>
  </div>
{/if}
