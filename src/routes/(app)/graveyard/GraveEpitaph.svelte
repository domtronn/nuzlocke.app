<script>
  import { capitalise, regionise } from '$lib/utils/string'
  import { format } from '$c/DeathModal/prose'
  export let pokemon, nickname, death

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Quote, Edit } from '$icons'

</script>

<p
  class:p-3={death?.epitaph}
  class:w-[20ch]={death?.epitaph}
  class='epitaph flex flex-col sm:hidden bg-gray-200 dark:bg-gray-700 rounded-lg leading-5 mt-4 relative z-0'
  >

  <Icon size={48} class='absolute -top-1 -left-1 scale-200' inline={true} icon={Quote} />
  <Icon size={48} class='absolute scale-150 rotate-180 -bottom-1 -right-1' inline={true} icon={Quote} />

  {format(death?.epitaph, { pokemon: { name: capitalise(regionise(pokemon)) }, nickname, ...death })}

  <br />

  <small
    class:-mt-4={death?.lvl}
    class=text-gray-400
    >
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
    class='sm:hidden w-full text-center absolute -bottom-1 translate-y-full left-0'
    on:click={onclick}>
    <span class='inline-flex items-center gap-x-1 pr-1 text-sm dark:text-gray-500 text-gray-400 border-b  dark:border-gray-500 border-gray-400'>
      <Icon inline icon={Edit} /> Edit
    </span>
  </button>
</p>
