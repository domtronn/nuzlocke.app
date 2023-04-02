<script>
  export let pokemon, nickname = '', death = {}, id

  import { capitalise, regionise } from '$lib/utils/string'
  import { IMG, createImgUrl } from '$utils/rewrites'

  import GraveEpitaph from './GraveEpitaph.svelte'
  import { format } from '$c/DeathModal/prose'
  import { Tooltip, Picture } from '$c/core'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Quote, Edit, Plus } from '$icons'

  import { getContext, createEventDispatcher } from 'svelte'
  const { getPkmn } = getContext('game')
  const dispatch = createEventDispatcher()

  let Pokemon
  $: getPkmn(pokemon).then(data => Pokemon = data)

  const onclick = () => dispatch('click', { pokemon, nickname, death })

  let gravehash = 0
  $: gravehash = death?.epitaph?.length || nickname?.length || pokemon?.length
  $: graveid = (id + 1) || ((gravehash % 12) + 1)

  let tooltip
  $: tooltip = format(death?.epitaph, { pokemon:{name: regionise(capitalise(pokemon))}, nickname, ...death })
</script>

<div
  on:click={onclick}
  class='grave group cursor-pointer w-36 h-48 mt-10 mx-auto transform scale-150 md:scale-100 z-20'>

<!-- Epitaph tooltip -->
  {#if tooltip}
    {#key tooltip}
      <Tooltip>{tooltip}</Tooltip>
    {/key}
  {/if}

<!-- Tombstone Image -->
  {#key gravehash}
    <Picture
      pixelated
      class='tombstone tombstone--{graveid}'
      alt="Tombstone for {nickname} the {pokemon}"
      src='https://img.nuzlocke.app/graves/grave-{graveid}'
      aspect=192x256
    />
  {/key}

<!-- Edit / add Button controls -->
  <div
    class:opacity-0={death?.epitaph}
    class:opacity-100={!death?.epitaph}
    class='w-full text-center absolute -bottom-2 group-hover:opacity-100 transition-all right-0'>
    <span
      class:border-b={!death?.epitaph}
      class:text-[10px]={!death?.epitaph}
      class='inline-flex items-center gap-x-1 text-xs dark:text-gray-500 text-gray-400 dark:border-gray-500 border-gray-400'
    >
      {#if tooltip}
        <Icon inline icon={Edit} />
        Click to edit
      {:else}
        <Icon inline icon={Plus} />
        Add epitaph
      {/if}
    </span>
  </div>


  <!-- Grave data container - Lvl / Image / Name -->

  <div class='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full flex flex-col gap-1 justify-end items-center'>
    {#if death?.lvl}
      <p class='z-20 top-2 lvl !text-lg max-md:hidden'>
        {#if death?.lvl?.from && death?.lvl?.to}
          <small>Lv</small>{death?.lvl?.from}-<small>Lv</small>{death?.lvl?.to}
        {:else if death?.lvl?.to}
          Died <small>Lv</small>{death?.lvl?.to}
        {/if}
      </p>
    {/if}

    {#if Pokemon}
      <img class='pkmn z-10 -mt-4 -mb-7 mix-blend-darken' alt="{nickname} the {pokemon}" src={createImgUrl(Pokemon, { ext: 'png'})} />
    {/if}

    <p class='pt-4 text-center z-20'>
      {#if nickname}
        {capitalise(nickname)} the <br />  {regionise(capitalise(pokemon))}
      {:else}
        An unknown <br /> {regionise(capitalise(pokemon))}
      {/if}
    </p>
  </div>

</div>

{#if death?.epitaph}
  <GraveEpitaph {death} {pokemon} {nickname} />
{/if}



<style>
  p:not(.epitaph) {
    @apply w-full leading-3 font-mono text-base text-center text-gray-100;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.75);
  }

  .grave {
    @apply transition-all;
  }

  .pkmn { @apply z-20 grayscale}

  :global(.tombstone) { @apply absolute inset-2; filter: grayscale(0.8) contrast(0.7) brightness(0.8); }
  :global(.tombstone--1),
  :global(.tombstone--5),
  :global(.tombstone--7),
  :global(.tombstone--8),
  :global(.tombstone--9),
  { @apply absolute; filter: grayscale(0.8) contrast(0.5) brightness(0.6); }


  :global(.tombstone.tombstone--1) { @apply transform skew-x-3 scale-110 scale-x-125 translate-y-3 translate-x-0.5; }
  :global(.tombstone.tombstone--2) { @apply transform -skew-x-3 translate-y-2 -translate-x-1; }
  :global(.tombstone.tombstone--3) { @apply transform -skew-y-2 translate-y-1 -translate-x-1; }
  :global(.tombstone.tombstone--4) { @apply transform skew-y-6 -translate-y-2 scale-y-110; }
  :global(.tombstone.tombstone--5) { @apply transform -skew-y-1 scale-90 skew-x-3 translate-y-2 translate-x-1;  }
  :global(.tombstone.tombstone--6) { @apply transform -skew-x-3 scale-x-110 -rotate-6 skew-y-6; }
  :global(.tombstone.tombstone--7) { @apply transform -skew-x-1 scale-x-110 rotate-1 -skew-y-1 translate-y-2 scale-x-90 scale-y-90; }
  :global(.tombstone.tombstone--8) { @apply transform -rotate-6 scale-x-75 scale-y-90 skew-y-3 translate-y-2 translate-x-1; }
  :global(.tombstone.tombstone--9) { @apply transform rotate-2 scale-y-110 scale-x-90 -translate-y-1; }
  :global(.tombstone.tombstone--11) { @apply transform translate-y-5 -translate-x-1 -rotate-3 skew-y-3; }
  :global(.tombstone.tombstone--12) { @apply transform translate-y-4 translate-x-1 scale-x-90 skew-x-3 rotate-3; }

  @media (min-width: theme('screens.md')) {
    .grave:hover {
      @apply transform scale-110  ;
    }

    .grave:hover .pkmn {
      filter: none;
    }
  }
</style>
