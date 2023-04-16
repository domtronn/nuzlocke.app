<script>
  import { createEventDispatcher } from 'svelte'
  import { crossfade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import { PIcon } from '$c/core'

  const [send, receive] = crossfade({ duration: 200 })
  const dispatch = createEventDispatcher()
  const locid = (a) => a.customId || a.location

  export let team = [],
    box = []

  $: teamList = team.map((t) => locid(t.original))
  $: boxList = box.filter((i) => !teamList.includes(locid(i.original)))

  const add = (poke) => () => {
    dispatch('add', poke)
  }
  const remove = (poke) => () => {
    dispatch('remove', poke)
  }
  const select = (poke) => () => {
    dispatch('select', poke)
  }
</script>

<h2>Your selected team</h2>

<ul class="mt-3 mb-4 grid w-fit grid-cols-6">
  {#each team as poke (locid(poke.original))}
    {@const og = poke.original}
    <button
      title="Remove {poke.pokemon} from team"
      class="selected relative mx-auto h-10 w-10"
      on:click={select(og)}
      animate:flip={{ duration: 200 }}
      in:receive={{ key: locid(og) }}
      out:send={{ key: locid(og) }}
    >
      <PIcon class="picon" name={og.pokemon} />
    </button>
  {/each}
</ul>

<h2>Your box</h2>
<p>
  Select pokemon to build a team against {name}
</p>

<ul class="mt-2 grid w-fit grid-cols-12 rounded-lg bg-gray-800 px-4 py-2">
  {#each boxList as poke (locid(poke.original))}
    {@const og = poke.original}
    <button
      title="Add {poke.pokemon} to your team"
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
</ul>

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

  button:before {
    content: '';
    position: absolute;
    border-radius: 100%;
    @apply left-1/2 -bottom-2 h-4 w-8 -translate-x-1/2 bg-transparent transition;
  }

  button.selected::before {
    @apply bg-gray-400;
  }

  button:not(.selected):enabled:hover::before {
    @apply bg-gray-300;
  }

  :global(.dark) button.selected::before {
    @apply bg-gray-600;
  }

  :global(.dark) button:not(.selected):enabled:hover::before {
    @apply bg-gray-700;
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
</style>
