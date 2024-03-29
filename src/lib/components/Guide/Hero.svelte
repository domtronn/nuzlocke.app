<script>
  export let logo, title, theme, pid, description
  import { Logo as Picture } from '$c/core'
  import { IMG } from '$lib/utils/rewrites'
  import { SVGs } from './'
  import ThemeToggle from '$c/theme-toggle.svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Home } from '$icons'
  import { Track } from '$icons'

  import { savedGames, createGame } from '$store'

  const onnew = () => {
    savedGames.update(createGame(title + ' Nuzlocke', pid))
    window.location = '/game'
  }
</script>

<header
  style="--col1: {theme?.[0]}; --col2: {theme?.[1]}; --col3: {theme?.[2] ||
    '#000'}"
>
  <div class="g-container nav">
    <a title="Home" href="/" rel="external">
      <Icon inline={true} height="1.4rem" icon={Home} class="fill-current" />
    </a>
    <div>
      <ThemeToggle />
    </div>
  </div>

  <div class="g-container hero">
    {#if $$slots.hero}
      <slot name="hero" />
    {:else}
      <div>
        <small>Nuzlocke Tracker</small>
        <h1>Pokémon {title} Nuzlocke Guide</h1>

        <p>
          {#if description}
            {@html description}
          {:else}
            This guide contains useful information for a <strong
              >{title} Nuzlocke</strong
            >. Lists of all of the available Pokémon, the number of encounters,
            and detailed overviews of all <strong>Boss battles</strong>.
          {/if}
        </p>

        <button on:click={onnew}>
          <span>
            Start tracking
            <Icon
              inline={true}
              icon={Track}
              class="ml-2 translate-y-1 fill-current"
              height="1.4rem"
            />
          </span>
        </button>
      </div>

      <div>
        <Picture
          src="{IMG}{logo}"
          alt="{title} Logo"
          role="presentation"
          loading="eager"
          aspect="384x192"
          class="drop-shadow-mark h-32 w-auto md:-mt-16 md:h-auto"
        />
      </div>
    {/if}
  </div>

  {@html SVGs.waves}
</header>

<slot />

{#if !$$slots.hero}
  <div
    class="end g-container"
    style="--col1: {theme?.[0]}; --col2: {theme?.[1]}; --col3: {theme?.[2] ||
      '#000'}"
  >
    <p>
      Now that you're ready to take on the <b
        >Pokémon {title} Nuzlocke Challenge</b
      >, why not keep track of all your encounters with the
      <b>Nuzlocke Tracker</b>?

      <br />

      <button class="inverted" on:click={onnew}>
        Start Tracking
        <Icon
          inline={true}
          icon={Track}
          class="ml-2 translate-y-1 fill-current"
          height="1.4rem"
        />
      </button>
    </p>
  </div>
{/if}

<style lang="postcss">
  header {
    color: var(--col3);
    background: linear-gradient(150deg, var(--col1), var(--col2));
  }

  small {
    @apply text-sm font-bold uppercase leading-relaxed tracking-widest;
  }

  p {
    @apply text-sm leading-6 tracking-wide;
  }

  h1 {
    @apply my-4 text-4xl font-bold tracking-wide md:text-6xl;
  }

  .g-container {
    @apply flex flex-col-reverse items-start md:flex-row md:justify-between;
  }
  .g-container h1 {
    @apply max-w-3xl;
  }
  .g-container p {
    @apply max-w-xl;
  }
  .g-container > div {
    @apply relative;
  }

  :global(svg.waves) {
    @apply relative lg:-mt-24;
  }
  :global(.drop-shadow-mark) {
    @apply -translate-y-1/4 md:translate-y-1/2;
  }

  button {
    @apply z-50 my-6 cursor-pointer rounded-full p-1 px-6 py-4 text-xl font-medium tracking-widest opacity-100 transition;
    background-color: var(--col3);
    cursor: pointer;
  }

  button.inverted {
    @apply mx-auto flex text-white;
    background: linear-gradient(130deg, var(--col1), var(--col2));
  }

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

  .hero {
    @apply pt-20;
  }
  .nav {
    @apply flex flex-row justify-between py-4;
  }
  .nav div {
    @apply -mt-2;
  }
  .end {
    @apply mt-12 -mb-6 text-center;
  }
  .end p {
    @apply mx-auto text-base leading-loose;
  }

  header :global(svg) {
    @apply translate-y-px;
  }
</style>
