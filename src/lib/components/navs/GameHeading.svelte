<script>
  export let className = ''
  import { activeGame, savedGames, parse } from '$lib/store'
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

 import { MiniTeamController } from '$c/TeamBuilder'

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
  import { Logo, Popover } from '$lib/components/core'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Box, Save, Game, Grave, Caret, CaretRight } from '$icons'

  const pages = [
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
    { name: 'Grave', link: '/graveyard', icon: Grave },
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
          <Logo
            src=/assets/{game?.game}
            class='h-10 w-auto pt-2 md:mr-4 md:w-20 md:h-auto'
            alt='{game?.game} logo'
            aspect=192x96
            />
          <h1 in:fade class='hidden md:block group-hover:border-black dark:group-hover:border-white'>
            {game?.name || ''}
          </h1>
        {/if}
      </a>

      {#if games.length}
        <Popover title='Load saves' position={window?.innerWidth < 700 ? 'bottom' : 'right'}>
          <span class='inline-flex'>
            <Icon inline={true} class='transition fill-current ml-2' icon={Save} />
            <Icon inline={true} class='hidden sm:block transition fill-current -ml-0.5' icon={CaretRight} />
            <Icon inline={true} class='block sm:hidden transition fill-current -ml-0.5' icon={Caret} />
          </span>

          <ul in:fly={{ duration: 250, y: 50 }} out:fade={{ duration: 100 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-60 mt-6 ml-4 sm:mt-4 sm:ml-2 flex flex-col divide-y dark:divide-gray-700 max-h-[80vh] overflow-scroll' slot=popover>
            <strong class='bg-black sm:bg-gray-800 text-white dark:bg-black rounded-t-xl -mb-px z-50 py-3 px-4'>Load Game</strong>
            {#each games as game}
              <button on:click={load(game)}>
                <li
                  class='px-4 py-2 text-gray-600 dark:text-gray-200 w-full text-sm cursor-pointer dark:hover:text-blue-500 hover:text-blue-400 inline-flex justify-between text-left items-center transition'
                  title='Load game {game.name}'
                  >
                  {game.name}
                  <Logo
                    alt='{game.name} logo'
                    src=/assets/{game.game}
                    class='ml-2 w-16'
                    aspect=192x96
                  />
                </li>
                </button>
            {/each}
          </ul>
        </Popover>
      {/if}
    </div>

    <div class='max-md:fixed max-md:bottom-0 max-md:w-full w-auto text-center z-[1000] max-md:pb-2 max-md:pt-4 mt-2.5 max-md:border-t-2 bg-white/50 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-900 border-gray-200'>
      <MiniTeamController />
    </div>

    <span class='inline-flex relative'>
      <ThemeToggle />

      {#each pages as p}
        <a
          class=link
          class:active={p.link == $page.url.pathname}
          href={p.link}
          >
          <Icon inline={true} icon={p.icon} />
          {p.name}
        </a>
      {/each}

      <span id='sidenav_button' />

    </span>
  </div>
</nav>

<div class=fauxnav />

<style lang="postcss">
  .fauxnav { @apply h-9; }

  nav {
    position: fixed;
    z-index: 5000;
    @apply container mx-auto mb-8 md:mb-2 bg-black sm:bg-white text-white sm:text-black;
  }

  nav :global(.p-container) {
    @apply px-0;
  }

  :global(.dark) nav {
    @apply sm:bg-gray-800
  }

  @media (min-width:theme('screens.sm')) {
    .fauxnav { @apply h-16; }
    nav {
      width: 100%;
      left: 0;
      right: 0;
    }
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

  a.home { @apply inline-flex items-center ml-4 -mt-4 md:mt-0 md:-ml-2 h-12; }
  a.link { @apply inline-flex items-center gap-x-1 border-black transition p-2 px-3 md:p-4 text-sm md:text-base; }

  a.link.active { @apply border-b-2 bg-gray-50 text-black cursor-default; }
  a.link:not(.active) { @apply sm:text-gray-500 hover:text-black  cursor-pointer; }

  :global(.dark) a.link:not(.active) { @apply hover:text-gray-100 text-gray-400; }
  :global(.dark) a.link.active { @apply hover:text-gray-100 text-gray-50 bg-gray-900 border-b-gray-200; }

  #sidenav_button {
    @apply z-50 md:z-10 bottom-6 right-4 fixed md:absolute md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-full flex items-center justify-center;
  }
</style>
