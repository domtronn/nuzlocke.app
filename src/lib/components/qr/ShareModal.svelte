<script>
  export let id

  import QRCode from './QRCode.svelte'
  import { PIcon } from '$lib/components/core'

  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { random } from '$lib/utils/arr'
  import { page } from '$app/stores'
  import { getGame, savedGames, activeGame, read, parse } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import Share from 'svelte-icons-pack/ri/RiSystemShareForwardLine'
  
  const { getPkmn } = getContext('game')
  
  let save, data
  savedGames.subscribe(parse(g => save = g[id]))
  getGame(id).subscribe(read(game => data = game))
  
  const selectPokemon = data => random(Object.values(data).filter(i => typeof i !== 'string')).pokemon
  const pokemon = selectPokemon(data)
  
  const fetchurl = (data) =>
        fetch('/api/tiny.json', {
          method: 'POST',
          body: JSON.stringify({
            url: `http://${$page.host}/drop?payload=${encodeURIComponent(JSON.stringify(data))}`
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
  
  {#await fetchurl({ data, save }) then tiny}
    
    <a transition:fade href={tiny.url} rel=external>
      <mark class='text-xs md:text-base tracking-wide font-bold'>
        https://tinyurl.com
      </mark>
      <mark class='text-3xl md:text-6xl'>
        {tiny.url.replace(/https:\/\/tinyurl.com/i, '')}
      </mark>
    </a>
    
    <div transition:fade class='p-2 bg-white'>
      <QRCode value={tiny.url} />
    </div>
  {/await}
  
  <p class='hidde md:block'>
    Open the <a href=/transfer>tranfer</a> page on the other device to scan the code using your camera
  </p>
</section>

<style>
  
  h1 {
    @apply text-lg md:text-4xl font-bold inline-flex items-center -mb-2
  }
  
  section {
    @apply bg-gray-50 text-gray-800 rounded-xl py-10 px-6 md:px-12 overflow-hidden flex flex-col items-center mx-auto gap-y-4
  }
  
  :global(.dark) section {
    @apply bg-gray-800 text-white
  }

  p { @apply text-center leading-5 text-sm max-w-xs }
  
  a mark { @apply bg-transparent transition }
  a { @apply mt-4 mb-8 flex flex-col items-center tracking-widest }
  
  
  :global(.dark) a mark { @apply text-yellow-500 }
  :global(.dark) a:hover mark { @apply bg-yellow-400 text-gray-900 }
  a mark { @apply text-yellow-400 transition }
  a:hover mark { @apply bg-yellow-300 text-gray-900 }
  
</style>
