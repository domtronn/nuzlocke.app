<script>
  import { activeGame, savedGames, parse, readdata, getGameStore } from '$lib/store'
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
    document.body.style = 'opacity: 0; transition: opacity: 0.2s'
    window.location.reload()
  }

  const reset = game => {
    if (!window.confirm('This will reset all data for this run, including your encounters, team & box. You cannot recover this data when it\'s reset. Are you sure?')) return

    const [,, id] = readdata()
    const gameStore = getGameStore(id)
    gameStore.set('{}')
  }

  import ThemeToggle from '$lib/components/theme-toggle.svelte'
  import { Icon, Logo, Button, Popover } from '$lib/components/core'
  import { Box, Save, Game, Grave, Caret, CaretRight, Dots } from '$icons'

  const pages = [
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
    { name: 'Grave', link: '/graveyard', icon: Grave },
  ]
</script>

<svelte:head>
  <title> Nuzlocke | {game?.name || ''} </title>
</svelte:head>

<nav class={$page.url.pathname.replace('/', '')}>
  <div class=p-container>
    <div class='inline-flex items-center'>
      <a
        href="/"
        rel="external"
        class='{$$restProps.class || ''} home group'>
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
        <Popover title='Load & manage game saves' position={window?.innerWidth < 700 ? 'bottom' : 'right'}>
          <span class='inline-flex'>
            <Icon inline={true} class='transition fill-current ml-2' icon={Save} />
            <Icon inline={true} class='hidden sm:block transition fill-current -ml-0.5' icon={CaretRight} />
            <Icon inline={true} class='block sm:hidden transition fill-current -ml-0.5' icon={Caret} />
          </span>

          <ul in:fly={{ duration: 250, y: 50 }} out:fade={{ duration: 100 }} class='popover bg-white dark:bg-gray-900 rounded-xl shadow-lg w-60 mt-6 ml-4 sm:mt-4 sm:ml-2 flex flex-col divide-y dark:divide-gray-700 max-h-[80vh] overflow-scroll' slot=popover>
            <strong class='bg-black sm:bg-gray-800 text-white dark:bg-black rounded-t-xl -mb-px z-50 py-3 px-4'>Games</strong>

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

            <li class='px-4 py-3 text-center'>
              <Button on:click={reset} rounded solid class='text-sm w-full'>New Attempt</Button>
              <small class='italic text-xs pt-2 opacity-50'>Abandon run and reset encounters</small>
            </li>
          </ul>
        </Popover>
      {/if}
    </div>

    {#if $page.url.pathname !== '/graveyard'}<MiniTeamController />{/if}

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
    </span>
  </div>
</nav>

<style lang="postcss">
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
    nav {
      width: 100%;
      left: 0;
      right: 0;
    }

    nav::before {
      content: '';
      background: linear-gradient(white 50%, transparent);
      @apply absolute w-full -bottom-6 h-6;
    }

    :global(.dark) nav::before {
      background: linear-gradient(theme('colors.gray.800') 50%, transparent);
    }
  }

  :global(.dark) nav {
    @apply sm:text-gray-200;
  }

  :global(.dark) nav.graveyard,
  nav.graveyard
  {
    @apply sm:bg-transparent;
  }

  :global(.dark) nav.graveyard::after,
  nav.graveyard::after {
    @apply sm:hidden;
  }

  h1 { @apply text-base sm:text-xl border-transparent border-b-2 transition -mb-1.5 sm:mb-0; }

  a.home { @apply inline-flex items-center ml-4 -mt-4 md:mt-0 md:-ml-2 h-12; }
  a.link { @apply inline-flex items-center gap-x-1 border-black transition p-2 px-3 md:p-4 text-sm md:text-base; }

  a.link.active { @apply border-b-2 bg-gray-50 text-black cursor-default; }
  a.link:not(.active) { @apply sm:text-gray-500 hover:text-black  cursor-pointer; }

  :global(.dark) a.link:not(.active) { @apply hover:text-gray-100 text-gray-400; }
  :global(.dark) a.link.active { @apply hover:text-gray-100 text-gray-50 bg-gray-900 border-b-gray-200; }
</style>
