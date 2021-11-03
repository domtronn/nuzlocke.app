<script>
  export let id = 25

  import { fly } from 'svelte/transition'
  import { activeGame, savedGames, parse, getGame, read, summarise } from '$lib/store'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'

  const interval = 5000
  const distance = 300

  let hovering = false
  const toggleHover = _ => hovering = !hovering

  let flip = 0
  setInterval(() => {
    flip = (flip + 1) % 2
    id = Math.round(Math.random() * 898)
  }, interval)

  let activeId, active = {}, summary = {}
  activeGame.subscribe(id => {
    activeId = id
    savedGames.subscribe(parse(games => {
      active = games[id]
    }))

    getGame(id).subscribe(read(summarise(data =>
      summary = data
    )))
  })

  $: duration = Math.min(interval / 3, 1000)
  $: src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
</script>

<main class='container mx-auto h-screen flex flex-col justify-center'>

  <span class='mx-auto text-center'>
    <img class:grayscale={!hovering} alt='Pokemon brand logo' src='/pkmn-logo.png' class='transition h-24 md:h-32 -translate-x-2 translate-y-2 mx-auto'/>
    <h1 class='font-mono text-4xl'>Nuzlocke tracker</h1>
  </span>

  <div class='py-11 px-10 sm:px-4 overflow-hidden mt-10'>
    <PixelatedContainer className='font-mono relative h-32 max-w-md mx-auto flex sm:flex-row justify-evenly items-center gap-y-2 text-3xl py-2 w-auto'>

      <div class='font-bold flex flex-col'>

        {#if active.game}
          <a class='mb-1 group' on:mouseenter={toggleHover} on:mouseleave={toggleHover} href="/game">
            <button class='tracking-widest group-hover:drop-shadow-text group-hover:text-pink-500'>
              Continue
            </button>
            <div class='flex flex-row group-hover:grayscale-0 grayscale items-center transition h-8 -mt-1 font-sans text-sm font-normal'>
              <img class='w-8 h-8 mr-2' src='/assets/{active.game}.png' alt='{active.game} logo' />
              <span>{summary.available.length}</span>
              <PIcon className='transform scale-75 -ml-1' type='item' name='poke-ball' />
              <span>{summary.deceased.length}</span>
              <Icon className='ml-1 w-3 h-3' src={Deceased} />
            </div>
          </a>
        {/if}

        <a href="/new">
          <button class='tracking-widest hover:drop-shadow-text hover:text-yellow-300' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            New Game
          </button>
        </a>

        <a href="/saves">
          <button class='tracking-widest hover:drop-shadow-text hover:text-blue-400' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            Load Game
          </button>
        </a>

        <span>
          <button class='tracking-widest hover:drop-shadow-text hover:text-orange-400' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            Settings
          </button>
          <!-- TODO: Rules -->
        </span>

      </div>

      <div class='img__container h-full -mx-12 relative'>
        {#if !flip}
          <img alt='Pokemon #{id}' class:grayscale={!hovering} src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute transition right-0 w-full -my-2 md:-my-12 -ml-12' />
        {/if}
        {#if flip}
          <img alt='Pokemon #{id}' class:grayscale={!hovering} src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute transition right-0 grayscale w-full -my-2 md:-my-12 -ml-12' />
        {/if}
      </div>
    </PixelatedContainer>
  </div>

</main>

<style>
  .img__container {
    width: theme('spacing.32');
  }

  @media (min-width: 640px) {
    .img__container {
      width: theme('spacing.52');
    }
  }

  img {
    image-rendering: pixelated;
    transition-duration: 300ms !important;
  }
</style>
