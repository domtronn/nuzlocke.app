<script context="module">
  export function load() {
    return { props: { id: 25 } }
  }
</script>

<script>
  export let id

  let flip = 0
  import { fly } from 'svelte/transition'

  const interval = 5000
  const distance = 400

  setInterval(() => {
    flip = (flip + 1) % 2
    id = Math.round(Math.random() * 898)
  }, interval)

  $: duration = Math.min(interval / 3, 1000)
  $: src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
</script>

<main class='container mx-auto h-screen flex flex-col justify-center'>

  <span class='mx-auto text-center'>
    <img src='/pkmn-logo.png' class='grayscale h-32 -translate-x-2 translate-y-2 mx-auto'/>
    <h1 class='font-mono text-5xl'>Nuzlocke tracker</h1>
  </span>

  <div class='py-11 px-10 sm:px-4 overflow-hidden mt-10'>
    <div class='pixel-border font-mono relative h-32 max-w-md mx-auto tracking-widest flex sm:flex-row justify-evenly items-center gap-y-2 text-3xl py-2 w-auto'>

      <div class='font-bold flex flex-col'>
        <span>New Game</span>
        <span>Load Game</span>
        <span>Settings</span>
      </div>

      <div class='h-full w-32 sm:w-52 -mx-12 relative'>
        {#if !flip}
          <img src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute right-0 grayscale w-32 sm:w-52 -my-2 sm:-my-12 -ml-12' />
        {/if}
        {#if flip}
          <img src={src} out:fly={{ y: distance, duration }} in:fly={{ y: -distance, duration }} class='absolute right-0 grayscale w-32 sm:w-52 -my-2 sm:-my-12 -ml-12' />
        {/if}
      </div>
    </div>
  </div>

</main>


<style>
  img {
    image-rendering: pixelated;
  }
  :root {
    --pixel-bg: theme('colors.gray.50');
    --pixel-border: black;
    --pixel-border-2: theme('colors.gray.200');
    --pixel-border-3: var(--pixel-border);
    --pixel: .3rem;
  }

  .pixel-border {
    background: var(--pixel-bg);
    box-shadow:

      /* Inner Background Color */
      0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg),

      /* Pixel Border Layer 1 */
      calc(var(--pixel) * -1) 0 0 0 var(--pixel-border),
      var(--pixel) 0 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * 2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-border),
      0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-border),

      /* Pixel Border Layer 2 */
      calc(var(--pixel) * -2) 0 0 0 var(--pixel-border-2),
      calc(var(--pixel) * 2) 0 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-border-2),
      0 var(--pixel) 0 var(--pixel) var(--pixel-border-2),
      0 calc(var(--pixel) * -4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * 4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
      0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),

      /* Border Layer 3: --pixel-border-3 */
      calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3),
      calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3),
      0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3),
      0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3),
      0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3);
  }

</style>
