<script>
  import Games from '$data/games.json'
  import Themes from '$data/theme.json'
  import { Logo as Picture } from '$c/core'
  import { Hero } from '$c/Guide'

  import { toSlug } from '$lib/utils/string'
  import { IMG } from '$lib/utils/rewrites'
  
  const title = `Nuzlocke Tracker | Pokémon Nuzlocke Guides`
  const description = `Find guides to Nuzlocking every Pokémon game from Generation 1 to 8 as well as some of the most popular Rom Hacks.`
</script>

<svelte:head>
  <title>{title}</title>
  <meta property=og:title content={title} />
  <meta property=twitter:title content={title} />
  
  <meta content={description} name=description />
  <meta content={description} name=twitter:description  />
</svelte:head>

<Hero theme={['#000', '#4a4a4a', '#fff']}>
  <svelte:fragment slot=hero>
    <div>
      <small>Nuzlocke Tracker</small>
      <h1>Pokémon Nuzlocke Guides</h1>
    </div>
  </svelte:fragment>
</Hero>

<main>
  {#each Object.values(Games) as { logo, region, title, gen, pid, lastUpdated = '9th Jan 2022'}}
    <a
      title='{title} Guide'
      style='--col1:{Themes[pid][0]};--col2:{Themes[pid][1]}'
      href='/guides/{toSlug(title)}' 
    >
      <div>
        <div>
          <Picture
            src='{IMG}{logo}'
            alt='{title} Logo'
            role=presentation
            aspect=180x90
            class=drop-shadow-mark
          />
        </div>
        <div>
          <h2>Pokémon {title} Nuzlocke Guide</h2>
          <p>
            See every Pokémon encounter & boss battle you'll face in
            Pokémon {title} to help you become the champion of the
            {region} region. 
          </p>
          <small>
            <span>{lastUpdated}</span>
            <span>Read More</span>
          </small>
        </div>
      </div>
    </a>
  {/each}
</main>

<style lang="postcss">
  main {
    @apply flex flex-wrap max-w-6xl mx-auto px-4 md:px-12 mt-12 pb-40
  }

  h1 {
    @apply text-6xl font-bold max-w-xl mt-1 mb-12 leading-normal text-center mx-auto
  }

  small {
    display: flex;
    @apply uppercase tracking-widest text-center block mx-auto
  }

  div {
    @apply mx-auto
  }

  main > a {
    @apply flex w-full md:w-1/2 lg:w-1/3 p-2
  }
  
  main > a > div {
    @apply transition rounded-xl overflow-hidden border shadow-md relative
  }

  main > a > div:hover {
    @apply -translate-y-3 translate-x-1 shadow-xl 
  }

  :global(.dark) main > a > div {
    @apply border-gray-900 bg-gray-900
  }

  div > div:first-child + div {
    @apply px-4 py-4 tracking-widest leading-normal;
  }

  h2 {
    @apply text-lg mb-2 font-bold;
  }

  p {
    @apply text-sm pb-8
  }

  :global(.dark) p {
    @apply text-gray-400
  }
  
  div div:first-child {
    background: linear-gradient(130deg, var(--col1), var(--col2));
    @apply px-3 py-6 md:py-4 flex justify-center rounded-none;
  }

  :global(.drop-shadow-mark) {
    transform: none !important;
  }

  p + small {
    @apply flex justify-between left-4 absolute bottom-3 right-4 m-0 mt-2 font-medium text-gray-600 
  }

  :global(.dark) p + small {
    @apply text-gray-200 
  }
  
</style>
