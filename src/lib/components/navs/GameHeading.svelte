<script>
  export let className = ''
  import { activeGame, savedGames, parse } from '$lib/store'
  import { fade } from 'svelte/transition'
  import { page } from '$app/stores'

  let game = {}
  activeGame.subscribe(id => {
    savedGames.subscribe(parse(games => {
      game = games[id]
    }))
  })

  import ThemeToggle from '$lib/components/theme-toggle.svelte'
  import { Picture } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiPackage'
  import Game from 'svelte-icons-pack/cg/CgGames'

  const pages = [
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
  ]
</script>

<svelte:head>
  <title> Nuzlocke | {game?.name || ''} </title>
</svelte:head>

<nav>
  <div class=p-container>
    <a
      href="/"
      rel="external"
      class='{className} home group'>
      {#if game?.game}
        <Picture
          src=/assets/{game?.game}
          className='hidden md:block md:mr-4 w-20'
          alt='{game?.game} logo'
          aspect=192x96
        />
        <h1 in:fade class='group-hover:border-black dark:group-hover:border-white'>
          {game?.name || ''}
        </h1>
      {/if}
    </a>

    <span class='inline-flex relative'>
      <ThemeToggle />

      {#each pages as p}
        <a
          class=link
          class:active={p.link == $page.path}
          href={p.link}
          >
          <Icon src={p.icon} className='fill-current' />
          {p.name}
        </a>
      {/each}

      <span id='sidenav_button' />

    </span>
  </div>
</nav>


<style>
  nav {
    @apply container mx-auto mb-8 md:mb-2 bg-black text-white sm:text-black sm:bg-transparent;
  }

  :global(.dark) nav {
    @apply sm:text-gray-200;
  }

  h1 { @apply text-base sm:text-xl border-transparent border-b-2 transition -mb-1.5 sm:mb-0; }

  a.home { @apply inline-flex items-center pt-4 ml-4 -mt-4 md:mt-0 md:-ml-2 h-12; }
  a.link { @apply inline-flex items-center gap-x-1 border-black transition p-2 px-3 md:p-4 text-sm md:text-base; }

  a.link.active { @apply border-b-2 bg-gray-50 text-black cursor-default; }
  a.link:not(.active) { @apply sm:text-gray-500 hover:text-black  cursor-pointer; }

  :global(.dark) a.link:not(.active) { @apply hover:text-gray-100 text-gray-400; }
  :global(.dark) a.link.active { @apply hover:text-gray-100 text-gray-50 bg-gray-900 border-b-gray-200; }

  #sidenav_button {
    @apply z-50 md:z-10 bottom-4 right-4 fixed md:absolute md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-full flex items-center justify-center;
  }
</style>
