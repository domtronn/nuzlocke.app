<script>
  export let id = 25

  import { createImgUrl, IMG } from '$utils/rewrites'

  import { flip as animflip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import { onMount } from 'svelte'

  import { readdata, summarise, trackData } from '$lib/store'
  import { PixelatedContainer } from '$lib/components/containers'

  import { Expanded as Games } from '$lib/data/games'
  import { Logo, Picture, PIcon, Icon } from '$lib/components/core'
  import { Deceased } from '$icons'

  const interval = 5000
  const distance = 300

  let flip = 0
  setInterval(() => {
    flip = (flip + 1) % 2
    id = Math.round(Math.random() * 151)
  }, interval)

  let activeId,
    active = {},
    summary = {}
  let links = [
    { title: 'New Game', href: '/new', color: 'blue' },
    { title: 'Load Game', href: '/saves', color: 'pink' },
    { title: 'Guides', href: '/guides', color: 'green' }
  ]

  onMount(() => {
    const [data, , id, save] = readdata()
    activeId = id
    active = save
    summarise((data) => {
      summary = data

      console.log(summary)
    })(data)

    if (active) {
      links = [
        {
          title: 'Continue',
          href: '/game',
          color: 'yellow',
          aria: 'Continue game: ' + active.name
        },
        ...links
      ]
    }

    trackData()
  })

  let src
  $: duration = Math.min(interval / 3, 1000)
  $: src = createImgUrl({ imgId: id }, { ext: 'png' })
</script>

<main>
  <h1 aria-level="1" class="mx-auto text-center font-mono text-4xl">
    Pokémon
    <Picture
      src="/logo"
      aspect="324x62"
      pixelated
      alt="Nuzlocke logo"
      className="transition h-auto md:h-16 mt-2 mx-auto"
    />
    tracker
  </h1>

  <div>
    <PixelatedContainer className="container__index">
      <div class="flex h-36 flex-col justify-center font-bold">
        {#each links as { title, href, color, aria } (href)}
          <a
            animate:animflip
            in:fly={{ x: -50 }}
            class="group tracking-widest hover:drop-shadow-text {color}"
            {href}
            aria-label={aria}
            data-sveltekit-preload-data
            rel="external"
          >
            {#if title === 'Continue'}
              {title}

              <div
                class="-ml-2 flex h-8 flex-row items-center font-sans text-sm font-normal transition group-hover:grayscale-0 md:grayscale"
              >
                <Logo
                  src="{IMG}{Games[active.game].logo}"
                  alt="{active.game} logo"
                  pictureClass="game--{active.game}"
                  class="ml-2 inline"
                  aspect="48xauto"
                />

                <PIcon
                  className="transform scale-75 -mr-1 -mt-0.5"
                  type="item"
                  name="poke-ball"
                />
                <span>{summary.available.length}</span>
                <Icon
                  inline={true}
                  class="mx-1 h-3 w-3 fill-current"
                  icon={Deceased}
                />
                <span>{summary.deceased.length}</span>
              </div>
            {:else}
              {title}
            {/if}
          </a>
        {/each}
      </div>

      <div class="img__container relative -mx-12 h-full">
        {#if !summary?.team?.length}
          {#if !flip}
            <img
              {src}
              rel="external"
              alt="Pokemon #{id}"
              class="absolute right-0 -my-2 -ml-12 w-full transition md:-my-12"
              out:fly={{ y: distance, duration }}
              in:fly={{ y: -distance, duration }}
            />
          {/if}
          {#if flip}
            <img
              {src}
              rel="external"
              alt="Pokemon #{id}"
              class="absolute right-0 -my-2 -ml-12 w-full transition md:-my-12"
              out:fly={{ y: distance, duration }}
              in:fly={{ y: -distance, duration }}
            />
          {/if}
        {:else}
          <div
            in:fly={{ y: -distance, duration }}
            class="absolute mt-14 -ml-4 inline-grid w-20 origin-left -translate-y-1/2 scale-200 transform grid-cols-2 transition md:mt-12 md:ml-0 md:w-24 md:grid-cols-3"
          >
            {#each summary.team as icon, i}
              <span
                style="--bob-delay: {(5 * ((i * 11) % 7)) / 10}s"
                class="bob relative h-8 w-8"
              >
                <PIcon
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  name={icon}
                />
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </PixelatedContainer>
  </div>

  <p>
    Keep track of your Pokémon encounters across multiple Nuzlocke runs, and
    prepare for Gym battles and Rival fights so you never wipe again! Get
    insights into team match ups, compare stat blocks and get detail on Gym
    movesets & abilities.
  </p>
</main>

<style lang="postcss">
  main {
    @apply container mx-auto mt-16 flex flex-col justify-center;
  }

  @media (min-width: 640px) {
    main {
      @apply absolute top-1/2 left-1/2 -mt-8 -translate-y-1/2 -translate-x-1/2;
    }
  }

  @media (min-height: 700px) {
    main {
      @apply absolute top-1/2 left-1/2 -mt-8 -translate-y-1/2 -translate-x-1/2;
    }
  }

  main > div {
    @apply mt-10 overflow-hidden py-7 px-6 sm:px-4;
  }

  p {
    @apply mx-auto mt-4 max-w-lg px-4 text-center text-tiny leading-4 text-gray-900;
  }

  :global(.dark) p {
    @apply text-gray-400;
  }

  :global(.container__index) {
    @apply relative mx-auto flex h-full max-h-56 w-auto max-w-md items-center justify-evenly gap-y-2 py-8 font-mono text-3xl sm:flex-row;
  }

  @media (max-width: 640px) {
    :global(.container__index > div) {
      @apply -ml-8;
    }
  }

  .img__container {
    @apply -mt-32;
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

  .pink {
    @apply hover:text-pink-500;
  }
  .blue {
    @apply hover:text-blue-400;
  }
  .green {
    @apply hover:text-green-400;
  }
  .yellow {
    @apply hover:text-yellow-400;
  }

  :global(.game--emkaizo),
  :global(.game--fr),
  :global(.game--sp),
  :global(.game--bd) {
    @apply -mr-2 -translate-x-1;
  }
  :global(.game--sw),
  :global(.game--sh) {
    @apply -mr-2 md:-mr-5 md:-translate-x-3;
  }

  :root {
    --bob-delay: 0.2s;
  }

  .bob {
    animation: bob 3s steps(1, end) var(--bob-delay) infinite;
  }

  @keyframes bob {
    5%,
    15%,
    25%,
    35%,
    45% {
      transform: translateY(-3px);
    }
    ,
    0%,
    10%,
    20%,
    30%,
    40%,
    50% {
      transform: translateY(0px);
    }
  }
</style>
