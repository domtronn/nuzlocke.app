<script>
  import { PixelatedContainer } from '$lib/components/containers'
  import { Picture, Icon } from '$lib/components/core'
  import { Heart } from '$icons'

  const credit = [
    {
      name: 'Beliot419',
      href: 'https://www.deviantart.com/beliot419',
      img: 'https://img.nuzlocke.app/leaders/sm-hala'
    },
    {
      name: 'Brumirage',
      href: 'https://www.instagram.com/brumirage',
      img: 'https://img.nuzlocke.app/leaders/rs-phoebe-oras'
    },
    {
      name: 'Drawnamu',
      href: 'https://www.deviantart.com/drawnamu',
      img: 'https://img.nuzlocke.app/leaders/sm-acerola'
    },
    {
      name: 'Gnomowladny',
      href: 'https://www.deviantart.com/gnomowladny',
      img: 'https://img.nuzlocke.app/leaders/rs-shelly-oras'
    },
    {
      name: 'Hyo',
      href: 'https://www.deviantart.com/hyo-oppa',
      img: 'https://img.nuzlocke.app/leaders/rs-maxie-oras'
    },
    {
      name: 'Kyledove',
      href: 'https://www.deviantart.com/kyle-dove',
      img: 'https://img.nuzlocke.app/leaders/xy-sycamore'
    },
    {
      name: 'Muzyun',
      href: 'https://www.deviantart.com/muzyun',
      img: 'https://img.nuzlocke.app/leaders/xy-mable'
    },
    {
      name: 'PKMNTrainerSpriterC',
      href: 'https://www.deviantart.com/PKMNTrainerSpriterC',
      img: 'https://img.nuzlocke.app/leaders/rs-wattson-oras'
    },
    {
      name: 'Poffin Case',
      href: 'https://pokengine.org/trainers/Courtney',
      img: 'https://img.nuzlocke.app/leaders/rs-tabitha-oras'
    },
    {
      name: 'Sugar and Spice',
      href: 'https://chipsncookies.tumblr.com/',
      img: 'https://img.nuzlocke.app/leaders/xy-lysandre'
    },
    {
      name: 'TintjeMadelintje101',
      href: 'https://www.deviantart.com/tintjemadelintje101',
      img: 'https://img.nuzlocke.app/leaders/xy-serena'
    },
    {
      name: 'tebited15',
      href: 'https://www.deviantart.com/tebited15',
      img: 'https://img.nuzlocke.app/leaders/xy-olympia'
    },
    {
      name: 'Unbound Team',
      href: 'https://www.pokecommunity.com/showthread.php?t=382178',
      img: 'https://img.nuzlocke.app/leaders/unbound-mirskle'
    },
    {
      name: 'Struedelmuffin, Wednesday and Rool',
      href: 'https://www.pokecommunity.com/showthread.php?t=412655'
    }
  ]
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Artist credit</title>
</svelte:head>

<main
  class="container mx-auto px-2 pb-24 pt-8 text-gray-800 dark:text-gray-300 sm:pt-0"
>
  <div class="mx-auto mx-4 pb-16 sm:pb-12">
    <PixelatedContainer
      className="my-16 py-6 px-8 overflow-x-hidden mx-auto text-center max-w-prose"
    >
      <h1 class="-mb-2 text-xl font-bold sm:text-2xl md:text-4xl">
        Artist Credits
      </h1>

      <div class="mx-6 my-4 inline-flex sm:mx-24 sm:my-6">
        {#each credit.slice(0, Math.floor(credit.length / 2)) as { name, img }, i (img)}
          {#if img}
            <div
              style="transform: scaleX({i % 2 ? -1 : 1})"
              class="-mx-6 md:-mx-8"
            >
              <Picture
                pixelated
                aspect="192x96"
                src={img}
                alt="Credit to {name}"
                className="gap-x-6 inline-block"
              />
            </div>
          {/if}
        {/each}
      </div>

      <p>
        This application is made infinitely better through the great work of the
        Pokémon community and their generosity in sharing it
      </p>

      <p>
        I want to say a huge thank you to those artists letting me use their
        work, and encourage you all to support them and check out their projects
        or portfolios below
      </p>

      <div class="mx-6 my-2 inline-flex sm:mx-24 md:my-6">
        {#each credit.slice(Math.ceil(credit.length / 2)) as { name, img }, i (img)}
          {#if img}
            <div
              style="transform: scaleX({i % 2 ? -1 : 1})"
              class="-mx-6 md:-mx-8"
            >
              <Picture
                pixelated
                src={img}
                alt={'Credit to ' + name}
                className="gap-x-6 inline-block"
                aspect="192x96"
              />
            </div>
          {/if}
        {/each}
      </div>

      <h2 class="mb-4 inline-flex items-center text-xl font-bold md:text-2xl">
        Thank you
        <Icon
          inline={true}
          height="1.2em"
          class="ml-2 fill-current text-red-500"
          icon={Heart}
        />
      </h2>

      <p class="whitespace-normal">
        {#each credit as { name, href }, i}
          <a
            class="mr-1 underline transition hover:text-indigo-400"
            {href}
            rel="noreferrer"
            target="_blank"
          >
            {name}{i < credit.length - 1 ? ',' : ''}
          </a>
        {/each}
      </p>
    </PixelatedContainer>
  </div>
</main>

<style lang="postcss">
  p {
    margin-bottom: 16px;
    @apply px-0 text-sm sm:px-12 md:px-16 md:text-base;
  }
</style>
