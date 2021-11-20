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

<nav class='container mx-auto mb-8 md:mb-2 bg-black text-white dark:sm:text-gray-200 sm:text-black sm:bg-transparent'>
  <div class="w-full sm:w-2/3 md:w-3/4 sm:px-4 md:px-8 mx-auto flex justify-between">
    <a
      href="/"
      rel="external"
      class='{className} inline-flex items-center pt-4 ml-4 -mt-4 md:mt-0 md:-ml-2 group h-12'>
      {#if game?.game}
        <Picture
          src=/assets/{game?.game}
          className='hidden md:block md:mr-4'
          alt='{game?.game} logo'
          aspect=192x96
        />
        <h1 in:fade class='text-md sm:text-xl group-hover:border-black dark:group-hover:border-white border-transparent border-b-2 transition -mb-1.5 sm:mb-0'>
          {game?.name || ''}
        </h1>
      {/if}
    </a>

    <span class='inline-flex relative'>
      <ThemeToggle />

      {#each pages as p}
        <a
          class='inline-flex items-center gap-x-1 border-black transition p-2 px-3 md:p-4 text-sm md:text-base'
          class:border-b-2={p.link == $page.path}
          class:bg-gray-50={p.link == $page.path}
          class:dark:bg-gray-900={p.link == $page.path}
          class:dark:text-gray-200={p.link == $page.path}
          class:dark:border-b-gray-200={p.link == $page.path}
          class:text-black={p.link == $page.path}
          class:cursor-default={p.link == $page.path}
          class:sm:text-gray-500={p.link !== $page.path}
          class:text-white={p.link !== $page.path}
          class:hover:text-black={p.link !== $page.path}
          class:dark:hover:text-gray-200={p.link !== $page.path}
          class:cursor-pointer={p.link !== $page.path}
          href={p.link}
          >
          <Icon src={p.icon} className='fill-current' />
          {p.name}
        </a>
      {/each}

      <span class='z-50 md:z-10 bottom-4 right-4 fixed md:absolute md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-full flex items-center justify-center' id='sidenav_button' />

    </span>
  </div>
</nav>
