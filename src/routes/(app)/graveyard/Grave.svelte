<script>
  export let pokemon, nickname = '', death, i, graveid

  import { capitalise } from '$lib/utils/string'
  import { IMG, createImgUrl } from '$utils/rewrites'

  import { format } from '$c/DeathModal/prose'
  import { Tooltip, Picture } from '$c/core'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Quote } from '$icons'

  import { getContext } from 'svelte'
  const { getPkmn } = getContext('game')

  let Pokemon
  $: getPkmn(pokemon).then(data => Pokemon = data)

  const gravehash = death?.epitaph?.length || nickname?.length || pokemon?.length
  $: graveid = graveid || ((gravehash % 12) + 1)
</script>

<div class='grave w-32 h-48 md:-mt-10 mx-auto transform scale-150 md:scale-100'>

  {#if death?.epitaph}
    <Tooltip>
      {format(death.epitaph, { pokemon:{name:capitalise(pokemon)}, nickname, ...death })}
    </Tooltip>
  {/if}

<Picture
  pixelated
  class='tombstone tombstone--{graveid}'
  alt="tombstone for {nickname} the {pokemon}"
  src='https://img.nuzlocke.app/graves/grave-{graveid}'
  aspect=192x256
  />


{#if Pokemon}
  <img class=pkmn alt="{nickname} the {pokemon}" src={createImgUrl(Pokemon, { ext: 'png'})} />
  {/if}

  <span>
    {#if nickname}
      {capitalise(nickname)} <br /> the {capitalise(pokemon)}
    {:else}
      An unknown <br /> {capitalise(pokemon)}
    {/if}
    <br />
    {#if death?.lvl}
      {#if death?.lvl?.from && death?.lvl?.to}
        <small class='t-2'>Lv</small>{death?.lvl?.from}-<small>Lv</small>{death?.lvl?.to}
      {:else if death?.lvl?.to}
        Died <small>Lv</small>{death?.lvl?.to}
      {/if}
      <br />
    {/if}
  </span>
</div>

{#if death?.epitaph}
  <p class='sm:hidden w-[20ch] p-3 bg-gray-200 dark:bg-gray-700 rounded-lg leading-5 relative'>
    <Icon size={48} class='absolute -top-1 -left-1 scale-200' inline={true} icon={Quote} />
    <Icon size={48} class='absolute scale-150 rotate-180 -bottom-1 -right-1' inline={true} icon={Quote} />
    {format(death.epitaph, { pokemon:{name:capitalise(pokemon)}, nickname, ...death })}
  </p>
{/if}

<style>

  img, span { @apply absolute left-1/2 -translate-x-1/2; }

  span {
    @apply w-full leading-3 font-mono text-base text-center text-gray-100 bottom-1/3 translate-y-4;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.75);
  }

  .grave {
    @apply transition-all;
  }

  .pkmn { @apply top-0 translate-y-6 -mt-3 z-20 grayscale; }
  :global(.tombstone) { @apply w-full absolute left-0; filter: grayscale(0.8) contrast(0.7) brightness(0.8); }

  :global(.tombstone.tombstone--1) {@apply mt-8 ml-1 -skew-x-3; }
  :global(.tombstone.tombstone--1 + .pkmn) {@apply top-6; }
  :global(.tombstone.tombstone--1) ~ span {@apply translate-y-6; }

  :global(.tombstone.tombstone--2) {@apply mt-2 mr-2 scale-90 -rotate-3 -skew-x-3; }
  :global(.tombstone.tombstone--2 + .pkmn) {@apply scale-125; }
  :global(.tombstone.tombstone--2) ~ span { @apply translate-y-1;}

  :global(.tombstone.tombstone--3) { @apply scale-90 mt-4 skew-x-1; }
  :global(.tombstone.tombstone--3 + .pkmn) { @apply -mt-2 }
  :global(.tombstone.tombstone--3) ~ span { @apply translate-y-1 }

  :global(.tombstone.tombstone--4) {@apply mt-2 transform -skew-y-3; }
  :global(.tombstone.tombstone--4 + .pkmn) { @apply scale-125 top-3; }
  :global(.tombstone.tombstone--4) ~ span { @apply translate-y-4 }

  :global(.tombstone.tombstone--5) {@apply mt-6 transform skew-x-3; filter: brightness(0.5) contrast(0.8) grayscale(0.9)}
  :global(.tombstone.tombstone--5 + .pkmn) {@apply scale-150 mt-2 -ml-2}
  :global(.tombstone.tombstone--5) ~ span {@apply translate-y-6 -ml-1}

  :global(.tombstone.tombstone--6) {@apply mt-6 -skew-x-3 scale-110; filter: brightness(0.8) contrast(0.5) grayscale(0.7)}
  :global(.tombstone.tombstone--6 + .pkmn) { @apply scale-110 ml-1 top-3 }
  :global(.tombstone.tombstone--6) ~ span {@apply translate-y-4}

  :global(.tombstone.tombstone--7) {@apply mt-6 skew-x-1 scale-90; }
  :global(.tombstone.tombstone--7 + .pkmn) { @apply mt-1; }
  :global(.tombstone.tombstone--7) ~ span {@apply translate-y-5; }

  :global(.tombstone.tombstone--9) {@apply -mt-1 -skew-y-1 scale-90 -rotate-2; }
  :global(.tombstone.tombstone--9 + .pkmn) { @apply top-2 scale-110; }
  :global(.tombstone.tombstone--9) ~ span { @apply ml-1 translate-y-2; }

  :global(.tombstone.tombstone--8) {@apply mt-3 ml-2 scale-75 skew-x-3 rotate-1 ; }
  :global(.tombstone.tombstone--8 + .pkmn) { @apply scale-125 top-3; }
  :global(.tombstone.tombstone--8) ~ span { @apply ml-1 translate-y-3 text-gray-50; }

  :global(.tombstone.tombstone--10) {@apply -translate-y-4 scale-100 ml-1 skew-x-1 rotate-1 ; }
  :global(.tombstone.tombstone--10 + .pkmn) { @apply -top-1 scale-125; }
  :global(.tombstone.tombstone--10) ~ span { @apply ml-1 translate-y-0; }

  :global(.tombstone.tombstone--11) {@apply mt-4 scale-90 skew-y-1 -rotate-2 ; }
  :global(.tombstone.tombstone--11 + .pkmn) { @apply scale-125 top-2; }
  :global(.tombstone.tombstone--11) ~ span { @apply translate-y-3; }

  :global(.tombstone.tombstone--12) {@apply -translate-y-2 skew-y-1 ml-1 scale-90 -rotate-2 ; }
  :global(.tombstone.tombstone--12 + .pkmn) { @apply -mt-5 scale-150; }
  :global(.tombstone.tombstone--12) ~ span { @apply -translate-y-0; }

  @media (min-width: theme('screens.md')) {
    .grave:hover {
      @apply transform scale-110  ;
    }

    .grave:hover .pkmn, .grave:hover span {
      filter: none;
    }
  }
</style>
