<script>
  export let links
  import { SVGs } from './'
  const order = ['romhack', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
</script>

<nav>
  {@html SVGs.lines}

  <div class=g-container>
    <h2>Other Nuzlocke Guides</h2>

    <div class=g-grid>
      {#each order as id}
        <div>
          <h3>{id.startsWith('rom') ? 'Rom hacks' : `Gen ${id}`}</h3>
          {#each links[id] as { href, logo, title }}
            <a
              {href}
              data-sveltekit-reload
              title='Pokémon {title} Nuzlocke Guide'>
              Pokémon {title}
            </a>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</nav>

<style lang="postcss">
  div.g-grid { @apply grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-4 }

  nav { @apply relative bg-gray-900 pb-40 mt-40 }

  a { @apply text-base py-2 md:text-xs flex items-center gap-x-2 md:py-0 text-gray-400 tracking-wide transition }
  a:hover { @apply text-gray-200 }
  h2, h3 { @apply text-gray-200 tracking-widest }
  h2 { @apply text-lg my-6 }
  h3 { @apply text-base }
</style>
