<script>
  export let logo, title, theme, pid
  import { Picture } from '$c/core'
  import { SVGs } from './'
  import ThemeToggle from '$c/theme-toggle.svelte'
  import Icon from 'svelte-icons-pack'
  import Home from 'svelte-icons-pack/ai/AiOutlineHome'
  import Track from 'svelte-icons-pack/ri/RiMapFootprintFill'

  import { savedGames, createGame } from '$store'

  const onnew = () => {
    savedGames.update(createGame(title + ' Nuzlocke', pid))
    window.location = '/game'
  }
</script>

<header style='--col1: {theme[0]}; --col2: {theme[1]}; --col3: {theme[2] || '#000'}'>
  <div class='g-container nav'>
    <a title='Home' href='/'>
      <Icon size=1.4rem src={Home} className=fill-current />
    </a>
    <div>
      <ThemeToggle />
    </div>
  </div>

  <div class='g-container hero'>
    <div>
      <small>Nuzlocke Tracker</small>
      <h1> Pokémon {title} Nuzlocke Guide </h1>
      <p>
        This guide contains useful information for a <strong>{title} Nuzlocke</strong>.
        Lists of all of the available Pokémon, the number of encounters, and detailed overviews of all <strong>Boss battles</strong>.
      </p>

      <button on:click={onnew}>
        <span>
          Start tracking
          <Icon src={Track} className='translate-y-1 ml-2 fill-current' size=1.4rem />
        </span>
      </button>
    </div>


    <div>
      <Picture
        src={logo}
        role=presentation
        aspect=192x96
        className=drop-shadow-mark
      />
    </div>
  </div>

  {@html SVGs.waves}
</header>

<slot />

<div class='end g-container' style='--col1: {theme[0]}; --col2: {theme[1]}; --col3: {theme[2] || '#000'}'>
  <p>
    Now that you're ready to take on the <b>Pokémon {title} Nuzlocke
      Challenge</b>, why not keep track of all your encounters with the
    <b>Nuzlocke Tracker</b>?

    <br />

    <button class=inverted on:click={onnew}>
      Start Tracking
      <Icon src={Track} className='translate-y-1 ml-2 fill-current' size=1.4rem />
    </button>
  </p>
</div>

<style>
  header {
    color: var(--col3);
    background: linear-gradient(150deg, var(--col1), var(--col2));
  }

  small {
    @apply uppercase text-sm leading-relaxed tracking-widest font-bold
  }

  p {
    @apply text-sm leading-loose tracking-widest
  }

  h1 {
    @apply text-4xl md:text-6xl font-bold my-4 tracking-wide

  }

  .g-container {
    @apply flex flex-col-reverse md:flex-row items-start md:justify-between
  }
  .g-container h1 { @apply max-w-3xl }
  .g-container p { @apply max-w-xl }
  .g-container > div { @apply relative }

  :global(svg.waves) { @apply relative lg:-mt-24}
  :global(.drop-shadow-mark) {
    @apply -translate-y-1/4 md:translate-y-1/2
  }

  button {
    @apply p-1 rounded-full z-50 my-6 font-medium px-6 py-4 text-xl tracking-widest transition cursor-pointer opacity-100;
    background-color: var(--col3);
    cursor: pointer;
  }

  button.inverted {
    @apply flex text-white mx-auto;
    background: linear-gradient(130deg, var(--col1), var(--col2));
  }

  :global(.dark) button.invert { @apply text-gray-900; }

  button:hover {
    opacity: 0.6;
  }

  button span {
    @apply flex;
    color: var(--col1);
  }

  header div:first-child {
    z-index: 60;
    position: relative;
  }

  .hero { @apply pt-20 }
  .nav { @apply py-4 flex flex-row justify-between }
  .nav div { @apply -mt-2 }
  .end { @apply text-center mt-12 -mb-6 }
  .end p { @apply mx-auto text-base leading-loose }

</style>
