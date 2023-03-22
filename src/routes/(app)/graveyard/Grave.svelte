<script>
  export let pokemon, nickname = '', death, i

  import { Tooltip, Picture } from '$c/core'
  import { capitalise } from '$lib/utils/string'

  import { format } from '$c/DeathModal/prose'

  import { IMG } from '$utils/rewrites'

  const gravehash = death?.epitaph?.length || nickname?.length || pokemon?.length
  const graveid = (gravehash % 12) + 1
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
  <img class=pkmn alt="{nickname} the {pokemon}" src='/assets/sprite/{pokemon}.png' />

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
  <p class='sm:hidden w-[20ch]'>
    {format(death.epitaph, { pokemon:{name:capitalise(pokemon)}, nickname, ...death })}
  </p>
{/if}

<style>

  img, span { @apply absolute left-1/2 -translate-x-1/2; }

  span { @apply w-full leading-3 tracking-tighter font-mono text-base text-center text-gray-300 drop-shadow-grave bottom-1/3 translate-y-4; }

  .pkmn { @apply top-0 translate-y-1/2 -mt-3 z-20 grayscale; }

  .grave {
    @apply transition-all;
  }

  :global(.dark) .grave {  }
  :global(.tombstone) { @apply w-full; filter: grayscale(0.8) contrast(0.7) brightness(0.8); }

  :global(.tombstone.tombstone--1) {@apply mt-8 ml-1 -skew-x-3; }
  :global(.tombstone.tombstone--1) + img {@apply -mt-2; }

  :global(.tombstone.tombstone--2) {@apply mt-6 mr-2 scale-90 -rotate-3 -skew-x-3; }
  :global(.tombstone.tombstone--2) ~ span { @apply -mb-1;}

  :global(.tombstone.tombstone--3) { @apply scale-90 mt-4 skew-x-1; filter: brightness(1.2); }
  :global(.tombstone.tombstone--3) + img { @apply -mt-4 }

  :global(.tombstone.tombstone--4) {@apply mt-2 transform -skew-y-3 mt-2; }
  :global(.tombstone.tombstone--4) + img { @apply scale-125; }

  :global(.tombstone.tombstone--5) {@apply mt-6 transform skew-x-3; filter: brightness(0.5) contrast(0.8) grayscale(0.9)}
  :global(.tombstone.tombstone--5) + img {@apply scale-125 -mt-5 -ml-1}
  :global(.tombstone.tombstone--5) ~ span {@apply -ml-1}

  :global(.tombstone.tombstone--6) {@apply mt-6 skew-x-3 scale-110; filter: brightness(0.8) contrast(0.5) grayscale(0.7)}
  :global(.tombstone.tombstone--6) + img { @apply -mt-4 }

  :global(.tombstone.tombstone--7) {@apply mt-6 skew-x-1 scale-90; }
  :global(.tombstone.tombstone--7) + img { @apply -mt-6; }


  :global(.tombstone.tombstone--9) {@apply -mt-1 -skew-y-1 -rotate-2; }
  :global(.tombstone.tombstone--9) + img { @apply -mt-6; }
  :global(.tombstone.tombstone--9) ~ span { @apply ml-1 translate-y-2; }

  :global(.tombstone.tombstone--8) {@apply mt-3 ml-2 scale-90 skew-x-3 rotate-1 ; }
  :global(.tombstone.tombstone--8) + img { @apply -mt-6; }
  :global(.tombstone.tombstone--8) ~ span { @apply ml-1 translate-y-2; }


  :global(.tombstone.tombstone--10) {@apply -mt-2 ml-1 skew-x-1 rotate-1 ; }
  :global(.tombstone.tombstone--10) + img { @apply -mt-8; }
  :global(.tombstone.tombstone--10) ~ span { @apply ml-1 translate-y-0; }



  :global(.tombstone.tombstone--11) {@apply mt-4 skew-y-1 -rotate-2 ; }
  :global(.tombstone.tombstone--11) + img { @apply -mt-8; }
  :global(.tombstone.tombstone--11) ~ span { @apply translate-y-0; }

  :global(.tombstone.tombstone--12) {@apply mt-4 skew-y-1 ml-1 scale-90 -rotate-2 ; }
  :global(.tombstone.tombstone--12) + img { @apply -mt-5; }

  @media (min-width: theme('screens.md')) {
    .grave:hover *, .grave:hover {
      @apply transform scale-110  ;
    }

    .grave:hover .pkmn, .grave:hover span {
      filter: none;
    }
  }
</style>
