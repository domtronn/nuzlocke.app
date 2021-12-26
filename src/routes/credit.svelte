<script context="module">
  export const prerender = true
</script>

<script>
  import { PixelatedContainer } from '$lib/components/containers'
  import { Picture } from '$lib/components/core'
  const credit = [
    { name: 'Beliot419', href: 'https://www.deviantart.com/beliot419', img: '/leaders/sm-hala' },
    { name: 'Brumirage', href: 'https://www.instagram.com/brumirage', img: '/leaders/rs-phoebe-oras' },
    { name: 'Drawnamu', href: 'https://www.deviantart.com/drawnamu', img: '/leaders/sm-acerola' },
    { name: 'Gnomowladny', href: 'https://www.deviantart.com/gnomowladny', img: '/leaders/rs-shelly-oras' },
    { name: 'Hyo', href: 'https://www.deviantart.com/hyo-oppa', img: '/leaders/rs-maxie-oras' },
    { name: 'Kyledove', href: 'https://www.deviantart.com/kyle-dove', img: '/leaders/xy-sycamore' },
    { name: 'Muzyun', href: 'https://www.deviantart.com/muzyun', img: '/leaders/xy-mable' },
    { name: 'PKMNTrainerSpriterC', href: 'https://www.deviantart.com/PKMNTrainerSpriterC', img: '/leaders/rs-wattson-oras' },
    { name: 'Poffin Case', href: 'https://pokengine.org/trainers/Courtney', img: '/leaders/rs-tabitha-oras' },
    { name: 'Sugar and Spice', href: 'https://chipsncookies.tumblr.com/', img: '/leaders/xy-lysandre' },
    { name: 'TintjeMadelintje101', href: 'https://www.deviantart.com/tintjemadelintje101', img: '/leaders/xy-serena' },
    { name: 'tebited15', href: 'https://www.deviantart.com/tebited15', img: '/leaders/xy-olympia' }
  ]

  import Icon from 'svelte-icons-pack'
  import Heart from 'svelte-icons-pack/bs/BsSuitHeartFill'

</script>

<svelte:head>
  <title>Nuzlocke Tracker | Artist credit</title>
</svelte:head>

<main class='container mx-auto text-gray-800 pb-24 pt-8 sm:pt-0 dark:text-gray-300'>
  <div class='mx-auto pb-16 sm:pb-12 mx-4'>
    <PixelatedContainer className='my-16 py-6 px-8 overflow-x-hidden mx-auto text-center max-w-prose'>

      <h1 class='text-4xl font-bold -mb-2'>Artist Credits</h1>

      <div class='inline-flex mx-24 my-6'>
        {#each credit.slice(0, Math.floor(credit.length / 2)) as { name, img }, i (img)}
          <div
            style='transform: scaleX({i % 2 ? -1 : 1})'
            class='-mx-8'>
            <Picture
              pixelated
              src={img}
              alt={'Credit to '+name}
              className='gap-x-6 inline-block'
              aspect=192x96
              />
          </div>
        {/each}
      </div>


      <p class='mx-16'>
        This application is made infinitely better through the great
        work of the Pokémon community and their generosity in sharing it
      </p>

      <p class='mx-16 '>
        I want to say a huge thank you to those artists letting me use their
         work, and encourage you all to support them and check
        out their projects or portfolios below
      </p>

      <div class='mx-24 inline-flex my-6'>
        {#each credit.slice(Math.ceil(credit.length / 2)) as { name, img }, i (img)}
          <div
            style='transform: scaleX({i % 2 ? -1 : 1})'
            class='-mx-8'>
            <Picture
              pixelated
              src={img}
              alt={'Credit to '+name}
              className='gap-x-6 inline-block'
              aspect=192x96
              />
          </div>
        {/each}
      </div>

      <h2 class='text-2xl font-bold inline-flex items-center mb-4'>
        Thank you
        <Icon size=1.2em className='fill-current ml-2 text-red-500' src={Heart} />
      </h2>

      <p class='mx-16 whitespace-normal'>
        {#each credit as { name, href }, i}
          <a class='mr-1 transition underline hover:text-indigo-400' {href} rel=external target=_blank>
            {name}{i < credit.length - 1 ? ',' : ''}
                       </a>
                     {/each}
                   </p>


    </PixelatedContainer>
  </div>
</main>

<style>
  td + td + td,
  th + th + th { display: none; }
  @media (min-width: 640px) {
    td + td + td,
    th + th + th { display: block; }
  }

  p { margin-bottom: 16px; }
  tr, thead { font-size: .75rem; }
  thead { text-align: left; }
  tr code { font-size: 1rem; }
</style>
