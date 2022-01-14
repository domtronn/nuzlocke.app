<script>
  export let className = ''
  import { activeGame, savedGames, parse } from '$lib/store'
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

  let game = {}, games
  activeGame.subscribe(id => {
    savedGames.subscribe(parse(g => {
      game = g[id]
      games = Object.values(g).filter(i => i.id !== id)
    }))
  })

  const load = game => {
    $activeGame = game.id
    window.location.reload()
  }

  import ThemeToggle from '$lib/components/theme-toggle.svelte'
  import { Picture, Popover } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiPackage'
  import Save from 'svelte-icons-pack/bi/BiSave'
  import Game from 'svelte-icons-pack/cg/CgGames'
  import RightArr from 'svelte-icons-pack/ai/AiFillCaretRight'
  import DownArr from 'svelte-icons-pack/ai/AiFillCaretDown'

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
    <div class='inline-flex items-center'>
      <a
      href="/"
      rel="external"
      class='{className} home group'>
      {#if game?.game}
        <Picture
          src=/assets/{game?.game}
          className='h-7 w-auto my-1 md:mr-4 md:w-20 md:h-auto'
          alt='{game?.game} logo'
          aspect=192x96
        />
        <h1 in:fade class='hidden md:block group-hover:border-black dark:group-hover:border-white'>
          {game?.name || ''}
        </h1>
      {/if}
    </a>

      {#if games.length}
        <Popover className='mt-1 sm:mt-4' title='Load saves' position={window?.innerWidth < 700 ? 'bottom' : 'right'}>
          <span class='inline-flex'>
            <Icon className='transition fill-current ml-2' src={Save} />
            <Icon className='hidden sm:block transition fill-current -ml-0.5' src={RightArr} />
            <Icon className='block sm:hidden transition fill-current -ml-0.5' src={DownArr} />
          </span>

          <ul in:fly={{ duration: 250, y: 50 }} out:fade={{ duration: 100 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-60 mt-6 ml-4 sm:mt-4 sm:ml-2 flex flex-col divide-y dark:divide-gray-700' slot=popover>
            <strong class='bg-black sm:bg-gray-800 text-white dark:bg-black rounded-t-xl -mb-px z-50 py-3 px-4'>Load Game</strong>
            {#each games as game}
              <li
                class='px-4 py-2 text-gray-600 dark:text-gray-200 w-full text-sm cursor-pointer dark:hover:text-blue-500 hover:text-blue-400 inline-flex justify-between items-center transition'
                title='Load game {game.name}'
                on:click={load(game)}>
                {game.name}

                <Picture
                  alt='{game.name} logo'
                  src=/assets/{game.game}
                  className='ml-2 w-16'
                  aspect=192x96
                  />
              </li>
            {/each}
          </ul>
        </Popover>
      {/if}

  </div>

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

<div class=fauxnav />

<style>
  .fauxnav { @apply h-12; }

  nav {
    position: fixed;
    z-index: 5000;
    @apply container mx-auto mb-8 md:mb-2 bg-black sm:bg-white text-white sm:text-black;
  }

  :global(.dark) nav {
    @apply sm:bg-gray-800
  }

  @media (min-width:theme('screens.sm')) {
    .fauxnav { @apply h-16; }
    nav {transform: translateX(32px);}
    nav::after {
      content: '';
      background: linear-gradient(white 50%, transparent);
      @apply absolute w-full -bottom-6 h-6;
    }

    nav::after {
      content: '';
      background: linear-gradient(white 50%, transparent);
      @apply absolute w-full -bottom-6 h-6;
    }

    :global(.dark) nav::after {
      background: linear-gradient(theme('colors.gray.800') 50%, transparent);
    }
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
    @apply z-50 md:z-10 bottom-6 right-4 fixed md:absolute md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-full flex items-center justify-center;
  }
</style>
