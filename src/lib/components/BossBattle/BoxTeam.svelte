<script>
  import { createEventDispatcher } from 'svelte'
  import { crossfade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import { PIcon, Icon } from '$c/core'
  import { Arrow, Pip } from '$icons'
  import { chunk } from '$lib/utils/arr'

  const [send, receive] = crossfade({ duration: 200 })
  const dispatch = createEventDispatcher()
  const locid = (a) => a.customId || a.location

  export let team = [],
    box = [],
    boss = {}

  $: teamList = team.map((t) => locid(t.original))
  $: boxList = box
    .filter((i) => !teamList.includes(locid(i.original)))
    .sort((a, b) => b.total - a.total)

  let page = 0,
    pages,
    max

  $: (pages = chunk(boxList, 8 * 3)), (max = pages.length - 1)
  $: if (page > max) page = max

  const inc = (_) => (page = Math.min(max, page + 1))
  const dec = (_) => (page = Math.max(0, page - 11))
  const set = (i) => (_) => (page = i)

  const select = (poke) => () => dispatch('select', poke)
  const clear = () => dispatch('clear')
  const reset = () => dispatch('reset')
</script>

<div class="mt-4 flex gap-x-4">
  <div>
    <h2>Team</h2>
    <span class="flex justify-start gap-x-4 text-right"
      ><button
        disabled={team.length == 0}
        on:click={clear}
        class="clear float-right text-xs italic underline underline-offset-2 opacity-50 hover:opacity-100"
      >
        Clear team
      </button>
      <button
        on:click={reset}
        class="clear float-right text-xs italic underline underline-offset-2 opacity-50 hover:opacity-100"
      >
        Reset
      </button>
    </span>

    <ul class="mt-3 mb-4 grid w-fit grid-cols-3 gap-y-2">
      {#each team as poke (locid(poke.original))}
        {@const og = poke.original}
        <button
          title="Remove {og.pokemon} from team"
          class="selected relative mx-auto h-10 w-10"
          on:click={select(og)}
          animate:flip={{ duration: 200 }}
          in:receive={{ key: locid(og) }}
          out:send={{ key: locid(og) }}
        >
          <PIcon class="picon" name={og.pokemon} />
        </button>
      {/each}
      {#each Array(6 - team.length) as _}
        <div class="relative h-10 w-10">
          <PIcon
            class="picon opacity-30 dark:opacity-80 dark:contrast-50"
            name="unknown-pokemon2"
          />
        </div>
      {/each}
    </ul>
  </div>

  <div>
    <h2>Box</h2>
    <div class="flex items-center">
      <p class="flex-1">Pick Pokemon from your boxes to face {boss.name}</p>

      {#each Array(pages.length) as p, i}
        <button
          disabled={page === i}
          class="pip"
          title="Box {i + 1}"
          on:click={set(i)}
        >
          <Icon inline="true" height="0.5rem" icon={Pip} />
        </button>
      {/each}
    </div>
    <ul
      class="mt-2 grid w-fit grid-cols-8 rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-800"
    >
      {#key page}
        {#each pages[page] as poke (locid(poke.original))}
          {@const og = poke.original}
          <button
            title={team.length === 6
              ? 'Your team is full!'
              : `Add ${og.pokemon} to your team`}
            class="relative mx-auto h-10 w-10"
            disabled={team.length === 6}
            on:click={select(og)}
            animate:flip={{ duration: 200 }}
            in:receive={{ key: locid(og) }}
            out:send={{ key: locid(og) }}
          >
            <PIcon class="picon" name={og.pokemon} />
          </button>
        {/each}
      {/key}
    </ul>
  </div>
</div>

<style>
  h2 {
    @apply text-sm font-bold;
  }

  p {
    @apply text-xs italic opacity-50;
  }

  :global(.picon) {
    @apply pointer-events-none absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2;
  }

  button:enabled:not(.selected):hover :global(.pkm) {
    animation: shake 3.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  }

  button:disabled {
    @apply grayscale;
  }

  button.clear::before,
  button.page::before,
  button.pip::before {
    content: none;
  }

  button:before {
    content: '';
    position: absolute;
    border-radius: 100%;
    @apply left-1/2 -bottom-0 h-4 w-8 -translate-x-1/2 opacity-0 transition-opacity;
  }

  button::before {
    @apply bg-black;
  }

  :global(.dark) button::before {
    @apply bg-white;
  }

  button.selected::before {
    @apply opacity-10;
  }

  button:not(.selected):enabled:hover::before {
    @apply opacity-20;
  }

  button.selected :global(.pkm) {
    animation: bob 3s ease infinite;
  }
  @keyframes bob {
    0% {
      transform: translateY(-8px);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(-8px);
    }
  }

  button {
    @apply transition;
  }

  button.page {
    @apply z-50 text-gray-600 transition hover:text-orange-600 disabled:cursor-default disabled:hover:text-gray-600;
  }

  :global(.dark) button.page {
    @apply text-gray-200 hover:text-orange-500 disabled:hover:text-gray-200;
  }

  .pip:disabled {
    @apply pointer-events-none scale-150 opacity-100;
  }
  .pip {
    @apply p-1 opacity-50;
  }
  .pip:enabled:hover {
    @apply text-orange-500 opacity-100;
  }
</style>
