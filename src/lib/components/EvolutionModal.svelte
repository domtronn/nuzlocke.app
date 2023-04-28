<script>
  export let base,
    evolutions,
    select = (_) => _

  import { capitalise, regionise } from '$lib/utils/string'

  import Picon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Bubbles } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const handleSelect = (d) => () => {
    select(d)
    close()
  }
</script>

<section
  class="mx-auto flex flex-col items-center rounded-lg bg-gray-50 p-8 pb-12 shadow-lg dark:bg-gray-900 dark:text-gray-200"
>
  <span><strong>{capitalise(base)}</strong> is evolving!</span>

  <span class="relative mb-8 mt-2 text-base">
    <Icon
      inline={true}
      icon={Bubbles}
      height="4rem"
      class="absolute top-0 left-0 animate-spin-slow-2 fill-current text-orange-200 dark:text-gray-800"
    />
    <span class="absolute -top-2 -left-2 animate-spin-slow">
      <Icon
        inline={true}
        icon={Bubbles}
        height="5rem"
        class="rotate-45 fill-current text-yellow-200 dark:text-gray-700"
      />
    </span>
    <span>
      <Picon name={base} className="absolute inset-0 transform scale-250" />
      <Picon
        name={base}
        className="filter brightness-200 saturate-0 transform scale-250 animate-full-pulse"
      />
    </span>
  </span>

  <div class="flex max-w-sm flex-wrap justify-center gap-x-12">
    {#each evolutions as e}
      <div class="group text-center">
        <button
          title="Evolve {regionise(capitalise(base))} into {capitalise(
            regionise(e)
          )}"
          aria-label="Evolve {regionise(capitalise(base))} into {capitalise(
            regionise(e)
          )}"
          on:click={handleSelect(e)}
        >
          <Picon
            class="scale-200 transition group-hover:scale-[2.2]"
            name={e}
          />
        </button>
        <p class="mt-4 w-full text-center text-xs italic">
          {regionise(capitalise(e))}
        </p>
      </div>
    {/each}
  </div>
</section>

<style lang="postcss">
  @keyframes shake {
    0%,
    50% {
      transform: rotate(0);
    }
    5%,
    45% {
      transform: rotate(-2deg);
    }
    10%,
    40% {
      transform: rotate(2deg);
    }
    15%,
    25%,
    35% {
      transform: rotate(-5deg);
    }
    20%,
    30% {
      transform: rotate(5deg);
    }
  }

  button {
    transition: transform 0.2s ease;
  }

  button:hover {
    cursor: pointer;
    animation: shake 3.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  }
</style>
