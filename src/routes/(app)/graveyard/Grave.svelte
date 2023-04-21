<script>
  export let pokemon,
    nickname = '',
    death = {},
    id

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
  $: getPkmn(pokemon).then((data) => (Pokemon = data))

  const onclick = () => dispatch('click', { pokemon, nickname, death })

  let gravehash = 0
  $: gravehash = death?.epitaph?.length || nickname?.length || pokemon?.length
  $: graveid = id + 1 || (gravehash % 12) + 1

  let tooltip
  $: tooltip = format(death?.epitaph, {
    pokemon: { name: regionise(capitalise(pokemon)) },
    nickname,
    ...death
  })
</script>

<div
  on:click={onclick}
  class="grave group z-20 mx-auto mt-10 h-48 w-36 scale-150 transform cursor-pointer md:scale-100"
>
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
      class="tombstone tombstone--{graveid}"
      alt="Tombstone for {nickname} the {pokemon}"
      src="https://img.nuzlocke.app/graves/grave-{graveid}"
      aspect="192x256"
    />
  {/key}

  <!-- Edit / add Button controls -->
  <div
    class:opacity-0={death?.epitaph}
    class:opacity-100={!death?.epitaph}
    class="absolute -bottom-2 right-0 w-full text-center transition-all group-hover:opacity-100"
  >
    <span
      class:border-b={!death?.epitaph}
      class:text-[10px]={!death?.epitaph}
      class="inline-flex items-center gap-x-1 border-gray-400 text-xs text-gray-400 dark:border-gray-500 dark:text-gray-500"
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

  <div
    class="absolute top-1/2 left-1/2 flex w-full -translate-y-1/2 -translate-x-1/2 flex-col items-center justify-end gap-1"
  >
    {#if death?.lvl}
      <p class="lvl top-2 z-20 !text-lg max-md:hidden">
        {#if death?.lvl?.from && death?.lvl?.to}
          <small>Lv</small>{death?.lvl?.from}-<small>Lv</small>{death?.lvl?.to}
        {:else if death?.lvl?.to}
          Died <small>Lv</small>{death?.lvl?.to}
        {/if}
      </p>
    {/if}

    {#if Pokemon}
      <img
        class="pkmn z-10 -mt-4 -mb-7 mix-blend-darken"
        alt="{nickname} the {pokemon}"
        src={createImgUrl(Pokemon, { ext: 'png' })}
      />
    {/if}

    <slot name="badges" />

    <p class="z-20 pt-4 text-center">
      {#if nickname}
        {capitalise(nickname)} the <br /> {regionise(capitalise(pokemon))}
      {:else}
        An unknown <br /> {regionise(capitalise(pokemon))}
      {/if}
    </p>
  </div>
</div>

{#if death?.epitaph}
  <GraveEpitaph {death} {pokemon} {nickname} on:edit={onclick}>
    <slot slot="badges" name="badges" />
  </GraveEpitaph>
{/if}

<style>
  p:not(.epitaph) {
    @apply w-full text-center font-mono text-base leading-3 text-gray-100;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.75);
  }

  .grave {
    @apply transition-all;
  }

  .pkmn {
    @apply z-20 grayscale;
  }

  :global(.tombstone) {
    @apply absolute inset-2;
    filter: grayscale(0.8) contrast(0.7) brightness(0.8);
  }
  :global(.tombstone--1),
  :global(.tombstone--5),
  :global(.tombstone--7),
  :global(.tombstone--8),
  :global(.tombstone--9) {
    @apply absolute;
    filter: grayscale(0.8) contrast(0.5) brightness(0.6);
  }

  :global(.tombstone.tombstone--1) {
    @apply translate-y-3 translate-x-0.5 skew-x-3 scale-110 scale-x-125 transform;
  }
  :global(.tombstone.tombstone--2) {
    @apply translate-y-2 -translate-x-1 -skew-x-3 transform;
  }
  :global(.tombstone.tombstone--3) {
    @apply translate-y-1 -translate-x-1 -skew-y-2 transform;
  }
  :global(.tombstone.tombstone--4) {
    @apply -translate-y-2 skew-y-6 scale-y-110 transform;
  }
  :global(.tombstone.tombstone--5) {
    @apply translate-y-2 translate-x-1 -skew-y-1 skew-x-3 scale-90 transform;
  }
  :global(.tombstone.tombstone--6) {
    @apply -rotate-6 -skew-x-3 skew-y-6 scale-x-110 transform;
  }
  :global(.tombstone.tombstone--7) {
    @apply translate-y-2 rotate-1 -skew-x-1 -skew-y-1 scale-x-110 scale-x-90 scale-y-90 transform;
  }
  :global(.tombstone.tombstone--8) {
    @apply translate-y-2 translate-x-1 -rotate-6 skew-y-3 scale-x-75 scale-y-90 transform;
  }
  :global(.tombstone.tombstone--9) {
    @apply -translate-y-1 rotate-2 scale-y-110 scale-x-90 transform;
  }
  :global(.tombstone.tombstone--11) {
    @apply translate-y-5 -translate-x-1 -rotate-3 skew-y-3 transform;
  }
  :global(.tombstone.tombstone--12) {
    @apply translate-y-4 translate-x-1 rotate-3 skew-x-3 scale-x-90 transform;
  }

  @media (min-width: theme('screens.md')) {
    .grave:hover {
      @apply scale-110 transform;
    }

    .grave:hover .pkmn {
      filter: none;
    }
  }
</style>
