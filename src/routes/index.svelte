<script context='module'>
  export const router = false
</script>

<script>

  export let id = 25

  import { fly } from 'svelte/transition'

  import { activeGame, savedGames, parse, getGame, read, summarise } from '$lib/store'
  import { PixelatedContainer } from '$lib/components/containers'

  import { Picture, PIcon } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'

  const interval = 5000
  const distance = 300

  let hovering = false
  const toggleHover = () => hovering = !hovering

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

    getGame(id).subscribe(read(summarise(data => summary = data)))
  })

  $: duration = Math.min(interval / 3, 1000)
  $: src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
</script>

<main class='container mx-auto h-screen -mt-16 flex flex-col justify-center'>
  <span class='mx-auto text-center'>
    <h1 class='font-mono text-4xl'>Pokémon</h1>
    <Picture
      src=/logo
      aspect=324x62
      pixelated
      alt='Nuzlocke logo'
      className='transition h-auto md:h-16 mt-2 mx-auto {hovering ? '' : 'grayscale'}'
    />
    <h1 class='font-mono text-4xl'>tracker</h1>
  </span>

  <div class='py-7 px-6 sm:px-4 overflow-hidden mt-10'>
    <PixelatedContainer className='font-mono relative max-h-48 max-w-md mx-auto flex sm:flex-row justify-evenly items-center gap-y-2 text-3xl py-8 h-full w-auto'>

      <div class='font-bold flex flex-col'>

        {#if active && active.game}
          <a class='mb-1 group tracking-widest hover:drop-shadow-text hover:text-pink-500'
             on:mouseenter={toggleHover}
             on:mouseleave={toggleHover}
             href='/game'
             sveltekit:prefetch
             rel=external
           >
            Continue
            <div class='flex flex-row group-hover:grayscale-0 grayscale items-center transition h-8 -mt-1 font-sans text-sm font-normal'>
              <Picture
                src=/assets/{active.game}
                alt='{active.game} logo'
                className=mr-2
                aspect=32xauto
              />

              <span>{summary.available.length}</span>
              <PIcon className='transform scale-75 -ml-1' type='item' name='poke-ball' />
              <span>{summary.deceased.length}</span>
              <Icon className='ml-1 w-3 h-3 fill-current' src={Deceased} />
            </div>
          </a>
        {/if}

        <a href="/new"
           class='tracking-widest hover:drop-shadow-text hover:text-yellow-300'
           sveltekit:prefetch
           on:mouseenter={toggleHover} on:mouseleave={toggleHover}
           rel=external
         >
            New Game
        </a>

        <a href="/saves"
           class='tracking-widest hover:drop-shadow-text hover:text-blue-400'
           sveltekit:prefetch
           on:mouseenter={toggleHover} on:mouseleave={toggleHover}
           rel=external
         >
          Load Game
        </a>

        <!-- <span> -->
        <!--   <button class='tracking-widest hover:drop-shadow-text hover:text-orange-400' on:mouseenter={toggleHover} on:mouseleave={toggleHover}> -->
        <!--     Settings -->
        <!--   </button> -->
        <!--   <\!-- TODO: Rules -\-> -->
        <!-- </span> -->

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
