<script>
  export let id

  import QRCode from './QRCode.svelte'
  import { PIcon } from '$lib/components/core'

  import { getContext } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { random } from '$lib/utils/arr'
  import { page } from '$app/stores'
  import { getGame, savedGames, activeGame, read, parse } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import Share from 'svelte-icons-pack/ri/RiSystemShareForwardLine'
  import Check from 'svelte-icons-pack/bi/BiMessageSquareCheck'
  
  const { getPkmn } = getContext('game')
  
  let save, data
  savedGames.subscribe(parse(g => save = g[id]))
  getGame(id).subscribe(read(game => data = game))
  
  let copy, copytimeout
  const handlecopy = url => _ => {
    navigator.clipboard.writeText(url);
    copy = true
    clearTimeout(copytimeout)
    setTimeout(() => copy = false, 1500)
  }
  
  const normalise = (url) => url.replace(/^https:/, window.location.protocol)
  const fetchurl = (data) =>
        fetch('/api/drop.json', {
          method: 'POST',
          body: JSON.stringify({
            url: `${window.location.protocol}//${$page.host}/drop?payload=${encodeURIComponent(JSON.stringify(data))}`
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
</script>

<section>
  <h1>
    <Icon src={Share} className='fill-current -ml-4 mr-2' />
    Transfer your save
  </h1>

  <p>
    Scan the QR code or go to the link below to transfer your save to
    a new device
  </p>
  
  <span style='min-height: 340px;'>
    {#await fetchurl({ data, save }) then drop}
      <span on:click={handlecopy(normalise(drop.url))} transition:fade>
        <mark class='text-xs md:text-base tracking-wide font-bold'>
          {normalise(drop.url).replace(/drop.*/, 'drop')}
        </mark>
        <mark class='text-4xl md:text-6xl'>
          {drop.url.replace(/.*\/drop/i, '')}
        </mark>
      </span>
      
      <div transition:fade class='p-2 bg-white'>
        <QRCode value={normalise(drop.url)} />
      </div>
    {/await}
  </span>
</section>

{#if copy}
  <div
    transition:fly={{ y: 50 }}
    class='fixed z-50 bottom-0 left-0 md:left-1/2 md:-translate-x-1/2 px-4 w-full md:w-auto' >
    <div class='inline-flex max-w-sm px-6 justify-center text-green-600 bg-green-100 rounded-t-lg py-2 w-full font-bold'>
      Copied share link!
      <Icon src={Check} size=1.4em className='ml-2 fill-current' />
    </div>
  </div>
{/if}

<style>
  
  h1 {
    @apply text-2xl md:text-4xl font-bold inline-flex items-center -mb-2
  }
  
  section {
    @apply bg-gray-50 text-gray-800 rounded-xl py-10 px-6 md:px-12 overflow-hidden flex flex-col items-center mx-auto gap-y-4
  }
  
  :global(.dark) section {
    @apply bg-gray-800 text-white
  }

  p { @apply text-center leading-5 text-sm max-w-xs }
  
  span mark { @apply bg-transparent transition cursor-pointer }
  span { @apply mt-4 mb-8 flex flex-col items-center tracking-widest }
  
  :global(.dark) span mark { @apply text-yellow-300 }
  :global(.dark) span:hover mark { @apply bg-yellow-200 text-gray-900 }
  span mark { @apply text-yellow-400 transition }
  span:hover mark { @apply bg-yellow-300 text-gray-900 }
  
</style>
