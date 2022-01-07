<script>
  export let logo, title, theme
  import { Picture } from '$c/core'
  import { SVGs } from './'
</script>

<header style='--col1: {theme[0]}; --col2: {theme[1]}; --col3: {theme[2] || '#000'}'>
  <div class=g-container>
    <div>
      <small>Nuzlocke Tracker</small>
      <h1> Pokémon {title} Nuzlocke Guide </h1>
      <p>
        This guide contains useful overview information for a <strong>{title} Nuzlocke</strong>.
        It shows you all of the Pokémon available during a run, the number of possible encounters, and detailed overvies of all <strong>Boss battles</strong>.
      </p>
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
    @apply text-4xl md:text-6xl font-bold my-4

  }

  header {
    @apply pt-16;
  }

  .g-container {
    @apply flex flex-col-reverse md:flex-row items-start md:justify-between
  }
  .g-container h1 { @apply max-w-3xl }
  .g-container p { @apply max-w-xl }
  .g-container > div { @apply relative }

  :global(svg.waves) { @apply relative lg:-mt-32}
  :global(.drop-shadow-mark) {
    @apply -translate-y-1/4 md:translate-y-1/2
  }
</style>
