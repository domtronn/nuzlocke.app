<script context="module">
  export function load() {
    return { props: { id: 25 } }
  }
</script>

<script>
  export let id

  import { fly } from 'svelte/transition'
  import { activeGame } from '$lib/store'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'

  const interval = 5000
  const distance = 300

  let hovering = false
  const toggleHover = _ => hovering = !hovering

  let flip = 0
  setInterval(() => {
    flip = (flip + 1) % 2
    id = Math.round(Math.random() * 898)
  }, interval)

  let active
  activeGame.subscribe(id => active = id)

  $: duration = Math.min(interval / 3, 1000)
  $: src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
</script>

<main class='container mx-auto h-screen flex flex-col justify-center'>

  <span class='mx-auto text-center'>
    <img class:grayscale={!hovering} src='/pkmn-logo.png' class='transition h-32 -translate-x-2 translate-y-2 mx-auto'/>
    <h1 class='font-mono text-5xl'>Nuzlocke tracker</h1>
  </span>

  <div class='py-11 px-10 sm:px-4 overflow-hidden mt-10'>
    <PixelatedContainer className='font-mono relative h-32 max-w-md mx-auto flex sm:flex-row justify-evenly items-center gap-y-2 text-3xl py-2 w-auto'>

      <div class='font-bold flex flex-col'>

        {#if active}
          <span>
            <button class='tracking-widest hover:drop-shadow-text hover:text-pink-500 transition duration-300' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
              Continue
            </button>
          </span>
        {/if}

        <span>
          <button class='tracking-widest hover:drop-shadow-text hover:text-yellow-300 transition duration-300' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            New Game
          </button>
        </span>

        <span>
          <button class='tracking-widest hover:drop-shadow-text hover:text-blue-400 transition duration-300' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            Load Game
          </button>
        </span>


        <span>
          <button class='tracking-widest hover:drop-shadow-text hover:text-orange-400 transition duration-300' on:mouseenter={toggleHover} on:mouseleave={toggleHover}>
            Settings
          </button>
        </span>

      </div>

      <div class='img__container h-full -mx-12 relative'>
        {#if !flip}
          <img class:grayscale={!hovering} src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute transition right-0 w-full -my-2 md:-my-12 -ml-12' />
        {/if}
        {#if flip}
          <img class:grayscale={!hovering} src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute transition right-0 grayscale w-full -my-2 md:-my-12 -ml-12' />
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
