<script>
  import { createEventDispatcher } from 'svelte'
  import { capitalise, regionise } from '$lib/utils/string'
  import { format } from '$c/DeathModal/prose'
  export let pokemon, nickname, death

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Quote, Edit } from '$icons'

  const dispatch = createEventDispatcher()
  const onclick = (_) => dispatch('edit')
</script>

<p
  class:p-3={death?.epitaph}
  class:w-[20ch]={death?.epitaph}
  class="epitaph relative z-0 mt-4 flex flex-col rounded-lg bg-gray-200 leading-5 dark:bg-gray-700 sm:hidden"
>
  <Icon
    size={48}
    class="absolute -top-1 -left-1 scale-200"
    inline={true}
    icon={Quote}
  />
  <Icon
    size={48}
    class="absolute -bottom-1 -right-1 rotate-180 scale-150"
    inline={true}
    icon={Quote}
  />

  {format(death?.epitaph, {
    pokemon: { name: regionise(capitalise(pokemon)) },
    nickname,
    ...death
  })}

  <br />

  <small class:-mt-4={death?.lvl} class="text-gray-400">
    {#if death?.lvl}
      <br />
      {#if death?.lvl?.from && death?.lvl?.to}
        Lv{death?.lvl?.from} - Lv{death?.lvl?.to}
      {:else if death?.lvl?.to}
        Died Lv{death?.lvl?.to}
      {/if}
    {/if}
  </small>

  <button
    class="absolute -bottom-1 left-0 w-full translate-y-full text-center sm:hidden"
    on:click={onclick}
  >
    <span
      class="inline-flex items-center gap-x-1 border-b border-gray-400 pr-1 text-sm text-gray-400 dark:border-gray-500 dark:text-gray-500"
    >
      <Icon inline icon={Edit} /> Edit
    </span>
  </button>
</p>
