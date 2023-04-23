<script>
  import {
    activeGame,
    savedGames,
    updateGame,
    parse,
    readdata,
    getGameStore
  } from '$lib/store'
  import { fade, fly } from 'svelte/transition'

  import { browser } from '$app/environment'
  import { page } from '$app/stores'

  import { MiniTeamController } from '$c/TeamBuilder'

  let game = {},
    games
  activeGame.subscribe((id) => {
    savedGames.subscribe(
      parse((g) => {
        game = g[id]
        games = Object.values(g).filter((i) => i.id !== id)
      })
    )
  })

  const load = (game) => {
    $activeGame = game.id
    document.body.style = 'opacity: 0; transition: opacity: 0.2s'
    window.location.reload()
  }

  const reset = (_) => {
    if (
      !window.confirm(
        "This will reset all data for this run, including your encounters, team & box. You cannot recover this data when it's reset. Are you sure?"
      )
    )
      return

    const [, , id] = readdata()
    const gameStore = getGameStore(id)

    savedGames.update(
      updateGame({
        ...game,
        attempts: +(game?.attempts || 1) + 1
      })
    )
    gameStore.set('{}')
  }

  import ThemeToggle from '$lib/components/theme-toggle.svelte'
  import { Icon, Logo, Button, Popover } from '$lib/components/core'
  import { Box, Save, Game, Grave, Caret, CaretRight, Dots } from '$icons'

  const pages = [
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
    { name: 'Grave', link: '/graveyard', icon: Grave }
  ]
</script>

<svelte:head>
  <title>Nuzlocke | {game?.name || ''}</title>
</svelte:head>

<nav class={$page.url.pathname.replace('/', '')}>
  <div class="p-container">
    <div class="inline-flex items-center">
      <a href="/" rel="external" class="{$$restProps.class || ''} home group">
        {#if game?.game}
          <Logo
            src="/assets/{game?.game}"
            pictureClass="game--{game?.game}"
            class="h-10 w-auto max-md:pt-2 sm:w-20 md:mr-4 md:h-auto"
            alt="{game?.game} logo"
            aspect="192x96"
          />

          <h1
            in:fade
            class="hidden line-clamp-1 group-hover:border-black dark:group-hover:border-white lg:block"
            class:sm:text-xl={game?.name?.length <= 20}
            class:sm:text-lg={game?.name?.length > 20}
          >
            {(game?.name || '').slice(0, 30)}{game?.name?.length > 30
              ? '...'
              : ''}
          </h1>
        {/if}
      </a>

      {#if browser}
        <Popover
          title="Load & manage game saves"
          position={window?.innerWidth < 700 ? 'bottom' : 'right'}
        >
          <span class="inline-flex">
            <Icon
              inline={true}
              class="ml-2 fill-current transition"
              icon={Save}
            />
            <Icon
              inline={true}
              class="-ml-0.5 hidden fill-current transition sm:block"
              icon={CaretRight}
            />
            <Icon
              inline={true}
              class="-ml-0.5 block fill-current transition sm:hidden"
              icon={Caret}
            />
          </span>

          <ul
            in:fly={{ duration: 250, y: 50 }}
            out:fade={{ duration: 100 }}
            class="popover mt-6 ml-4 flex max-h-[80vh] w-60 flex-col divide-y overflow-scroll rounded-xl bg-white shadow-lg dark:divide-gray-700 dark:bg-gray-900 sm:mt-4 sm:ml-2"
            slot="popover"
          >
            <strong
              class="z-50 -mb-px rounded-t-xl bg-black py-3 px-4 text-white dark:bg-black sm:bg-gray-800"
              >Games</strong
            >

            {#each games as game}
              <button on:click={load(game)}>
                <li
                  class="inline-flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-gray-600 transition hover:text-blue-400 dark:text-gray-200 dark:hover:text-blue-500"
                  title="Load game {game.name}"
                >
                  {game.name}
                  <Logo
                    alt="{game.name} logo"
                    src="/assets/{game.game}"
                    class="ml-2 w-16"
                    aspect="192x96"
                  />
                </li>
              </button>
            {/each}

            <li class="px-4 py-3 text-center">
              <Button on:click={reset} rounded solid class="w-full text-sm"
                >New Attempt</Button
              >
              <p class="pt-2 text-xs italic leading-4 opacity-50">
                Abandon your <b>{game?.name || ''}</b> run, reset all encounters
                and start attempt {+(game?.attempts || 1) + 1}
              </p>
            </li>
          </ul>
        </Popover>
      {/if}
    </div>

    {#if $page.url.pathname !== '/graveyard'}<MiniTeamController />{/if}

    <span class="relative inline-flex">
      <ThemeToggle />

      {#each pages as p}
        <a
          class="link"
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
    @apply container mx-auto mb-8 bg-black text-white sm:bg-white sm:text-black md:mb-2;
  }

  nav :global(.p-container) {
    @apply px-0;
  }

  :global(.dark) nav {
    @apply sm:bg-gray-800;
  }

  @media (min-width: theme('screens.sm')) {
    nav {
      width: 100%;
      left: 0;
      right: 0;
    }

    nav::before {
      content: '';
      background: linear-gradient(white 50%, transparent);
      @apply absolute -bottom-6 h-6 w-full;
    }

    nav.graveyard::before {
      display: none;
    }

    :global(.dark) nav::before {
      background: linear-gradient(theme('colors.gray.800') 50%, transparent);
    }
  }

  :global(.dark) nav {
    @apply sm:text-gray-200;
  }

  :global(.dark) nav.graveyard,
  nav.graveyard {
    @apply sm:bg-transparent;
  }

  :global(.dark) nav.graveyard::after,
  nav.graveyard::after {
    @apply sm:hidden;
  }

  h1 {
    @apply -mb-1.5 border-b-2 border-transparent text-base transition sm:mb-0;
  }

  a.home {
    @apply ml-4 -mt-4 inline-flex h-12 items-center md:mt-0 md:-ml-2;
  }
  a.link {
    @apply inline-flex items-center gap-x-1 border-black p-2 px-3 text-sm transition md:p-4 md:text-base;
  }

  a.link.active {
    @apply cursor-default border-b-2 bg-gray-50 text-black;
  }
  a.link:not(.active) {
    @apply cursor-pointer hover:text-black  sm:text-gray-500;
  }

  :global(.dark) a.link:not(.active) {
    @apply text-gray-400 hover:text-gray-100;
  }
  :global(.dark) a.link.active {
    @apply border-b-gray-200 bg-gray-900 text-gray-50 hover:text-gray-100;
  }

  :global(.game--sw),
  :global(.game--sh) {
    @apply -mr-4 -ml-4;
  }

  :global(.game--emkaizo) {
    @apply -mr-2 -ml-2;
  }

  @media (min-width: theme('screens.md')) {
    :global(.game--sw),
    :global(.game--sh) {
      @apply -mr-6 ml-0;
    }

    :global(.game--emkaizo) {
      @apply -mr-2 ml-0;
    }
  }
</style>
