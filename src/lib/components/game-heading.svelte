<script>
  export let className = ''
  import { activeGame, savedGames, getGame, theme, read, parse } from '$lib/store'
  import { fade } from 'svelte/transition'
  import { page } from '$app/stores'

  let game = {}
  activeGame.subscribe(id => {
    savedGames.subscribe(parse(games => {
      game = games[id]
    }))
  })

  import Toggle from 'svelte-toggle'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiPackage'
  import Game from 'svelte-icons-pack/cg/CgGames'
  import Home from 'svelte-icons-pack/ai/AiOutlineHome'
  import DarkMode from 'svelte-icons-pack/vsc/VscColorMode'

  const toggleTheme = () => {
    if ($theme === 'dark') {
      theme.set('light')
      document.documentElement.classList.remove('dark')
    } else {
      theme.set('dark')
      document.documentElement.classList.add('dark')
    }
  }

  const pages = [
    { name: 'Home', link: '/', icon: Home },
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
  ]
</script>

<nav class='container mx-auto mb-8 md:mb-2 bg-black text-white dark:sm:text-gray-200 sm:text-black sm:bg-transparent'>
  <div class="w-full sm:w-2/3 md:w-3/4 sm:px-4 md:px-8 mx-auto flex justify-between">
    <span class='{className} inline-flex items-center pt-4 ml-4 -mt-4 md:mt-0 md:-ml-2'>
      {#if game?.game}
        <img in:fade src='/assets/{game?.game}.png' alt={game?.game + ' logo'} width=48 class='h-auto mr-2 hidden md:block' />
        <h1 in:fade class='text-md sm:text-xl'>
          {game?.name || ''}
        </h1>
      {/if}
    </span>

    <span class='inline-block'>
      <span class='inline-flex gap-x-2 items-center'>
        <Icon size='1.2em' className='dark:text-gray-200' src={DarkMode} />
        <Toggle
          toggled={$theme === 'dark'}
          on:toggle={toggleTheme}
          small hideLabel label='Dark mode' />
      </span>

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
    </span>
  </div>
</nav>
