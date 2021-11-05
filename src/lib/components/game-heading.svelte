<script>
  export let className = ''
  import { activeGame, savedGames, getGame, read, parse } from '$lib/store'
  import { fade } from 'svelte/transition'
  import { page } from '$app/stores'

  let path = ''
  page.subscribe(p => path = p.path)

  let game = {}
  activeGame.subscribe(id => {
    savedGames.subscribe(parse(games => {
      game = games[id]
    }))
  })

  import Icon from 'svelte-icons-pack'
  import Box from 'svelte-icons-pack/bi/BiPackage'
  import Game from 'svelte-icons-pack/cg/CgGames'
  import Home from 'svelte-icons-pack/ai/AiOutlineHome'

  const pages = [
    { name: 'Home', link: '/', icon: Home },
    { name: 'Game', link: '/game', icon: Game },
    { name: 'Box', link: '/box', icon: Box },
  ]

</script>

<nav class='container mx-auto mb-8 bg-black text-white sm:text-black sm:bg-transparent'>
  <div class="w-full sm:w-2/3 md:w-3/4 sm:px-4 md:px-8 mx-auto flex justify-between">
    <span class='{className} inline-flex items-center pt-4 ml-4 -mt-4 md:mt-0 md:-ml-2'>
      {#if game?.game}
        <img in:fade src='/assets/{game?.game}.png' alt={game?.game + ' logo'} width=48 class='h-auto mr-2 hidden md:block' />
        <h1 in:fade class='text-xl'>
          {game?.name || ''}
        </h1>
      {/if}
    </span>

    <span class='inline-block'>
      {#each pages as p}
        <a
          class='inline-flex items-center gap-x-1 border-black transition p-3 md:p-4'
          class:border-b-2={p.link == path}
          class:bg-gray-50={p.link == path}
          class:text-black={p.link == path}
          class:cursor-default={p.link == path}
          class:sm:text-gray-500={p.link !== path}
          class:text-white={p.link !== path}
          class:hover:text-black={p.link !== path}
          class:cursor-pointer={p.link !== path}
          href={p.link}
          >
          <Icon src={p.icon} className='fill-current' />
          {p.name}
        </a>
      {/each}
    </span>
  </div>
</nav>
