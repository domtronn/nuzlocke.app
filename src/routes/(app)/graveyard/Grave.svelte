<script>
  export let pokemon, nickname = '', death, i

  import { capitalise } from '$lib/utils/string'
  import { IMG } from '$utils/rewrites'

  const gravehash = death?.epitaph?.length || nickname?.length || pokemon?.length
  const graveid = (gravehash % 9) + 1
</script>

<div class='grave ${i % 3 ? 'flip' : ''} relative w-32 h-48 mt-16 md:-mt-10 mx-auto'>

  <img class='tombstone tombstone--{graveid}' src='/graves/grave-{graveid}.png' />
  <img class=pkmn src='/assets/sprite/{pokemon}.png' />
  <span>
    {#if nickname}
      {nickname} <br /> the {capitalise(pokemon)}
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

<style>

  img, span { @apply absolute left-1/2 -translate-x-1/2; }

  span { @apply w-full leading-3 tracking-tighter font-mono text-base text-center text-gray-300 drop-shadow-grave bottom-1/3 translate-y-4; }

  .pkmn { @apply top-0 translate-y-1/2 -mt-3 z-20 grayscale; }

  .grave {
    @apply transition-all;
  }

  :global(.dark) .grave {  }
  .tombstone { @apply w-full; filter: grayscale(0.8) contrast(0.7) brightness(0.8); }

  .tombstone.tombstone--1 {@apply mt-8 ml-1 -skew-x-3; }
  .tombstone.tombstone--1 + img {@apply -mt-2; }

  .tombstone.tombstone--2 {@apply mt-6 mr-2 scale-90 -rotate-3 -skew-x-3; }
  .tombstone.tombstone--2 ~ span { @apply -mb-1;}

  .tombstone.tombstone--3 { @apply scale-90 mt-4 skew-x-1; filter: brightness(1.2); }
  .tombstone.tombstone--3 + img { @apply -mt-4 }

  .tombstone.tombstone--4 {@apply mt-2 transform -skew-y-3 mt-2; }
  .tombstone.tombstone--4 + img { @apply scale-125; }

  .tombstone.tombstone--5 {@apply mt-6 transform skew-x-3; filter: brightness(0.5) contrast(0.8) grayscale(0.9)}
  .tombstone.tombstone--5 + img {@apply scale-125 -mt-5 -ml-1}
  .tombstone.tombstone--5 ~ span {@apply -ml-1}

  .tombstone.tombstone--6 {@apply mt-6 skew-x-3 scale-110; filter: brightness(0.8) contrast(0.5) grayscale(0.7)}
  .tombstone.tombstone--6 + img { @apply -mt-4 }

  .tombstone.tombstone--7 {@apply mt-6 skew-x-1 scale-90; }
  .tombstone.tombstone--7 + img { @apply -mt-6; }


  .tombstone.tombstone--9 {@apply -mt-1 -skew-y-1 -rotate-2; }
  .tombstone.tombstone--9 + img { @apply -mt-6; }
  .tombstone.tombstone--9 ~ span { @apply ml-1 translate-y-2; }

  .tombstone.tombstone--8 {@apply mt-3 ml-2 scale-90 skew-x-3 rotate-1 ; }
  .tombstone.tombstone--8 + img { @apply -mt-6; }
  .tombstone.tombstone--8 ~ span { @apply ml-1 translate-y-2; }


  .grave:hover *, .grave:hover {
    @apply transform scale-110  ;
  }

  .grave:hover .pkmn, .grave:hover span {
    filter: none;
  }

</style>
