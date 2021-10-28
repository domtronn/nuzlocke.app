<script context="module">
  export function load({ error, status }) {
    const shiny = Math.round(Math.random() * 8) === 0

    return {
      props: {
        text: shiny
          ? 'text-pink-400'
          : 'text-blue-400',
        img: shiny
          ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/202.png'
          : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/202.png',
        status: status,
        message: error.message
      }
    };
  }
</script>

<script>
  export let text, img, status, message
  import Icon from 'svelte-icons-pack'
  import Question from 'svelte-icons-pack/bs/BsQuestion'
</script>


<div
  style="font-family: 'VT323', monospace;"
  class='max-w-lg mx-auto text-center flex flex-col items-center justify-center h-screen {text}'
  >
  <span class='z-20 relative mt-32'>
    <span class='centre text-8xl drop-shadow-text absolute -translate-y-full -translate-x-1/2 -top-3 -rotate-6' src={Question}>?</span>
    <span class='right text-7xl drop-shadow-text absolute translate-x-8 -translate-y-full top-0 rotate-12' src={Question}>?</span>
    <span class='left text-6xl drop-shadow-text absolute -translate-x-full -translate-y-full left-2 -top-1 -rotate-12' src={Question}>?</span>
    <span class=''>
      <h1 class='tracking-wide drop-shadow-text translate-y-48 font-bold text-6xl'>{status}</h1>
      <h2 class='tracking-wide translate-y-48'>{message}</h2>
    </span>
  </span>
  <img src={img} alt='wobuffet' class='w-96 mx-auto drop-shadow-md -translate-y-1/2 z-0' />
</div>
