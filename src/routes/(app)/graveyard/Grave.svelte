<script>
  export let pokemon, nickname = '', scale = 1
  import { capitalise } from '$lib/utils/string'

  console.log(pokemon)

  const graveid = ((nickname || pokemon).length % 7) + 1
</script>

<div class='grave relative w-32 h-48 mt-16 md:-mt-10 mx-auto transform scale-150 md:scale-100'>
  <img class='tombstone tombstone--{graveid}' src='/graves/grave{graveid}.webp' />
  <img class=pkmn src='/assets/sprite/{pokemon}.png' />
  <span>
    {#if nickname}
      {nickname} <br /> the {capitalise(pokemon)}
    {:else}
      An unknown <br /> {capitalise(pokemon)}
    {/if}
    <br />
  </span>
</div>

<style>

  img, span { @apply absolute left-1/2 -translate-x-1/2; }

  span { @apply w-full leading-3 tracking-tighter font-mono text-base text-center text-gray-300 drop-shadow-grave bottom-1/3 translate-y-4; }

  .pkmn { @apply top-0 translate-y-1/2 -mt-3 z-20 grayscale opacity-50; }

  :global(.dark) .grave { filter: brightness(0.7); }
  .grave { filter: brightness(1.2); }
  .tombstone { @apply w-full; filter: brightness(0.6); }

  .tombstone.tombstone--1 {@apply mt-4 -rotate-3 -skew-x-2; filter: brightness(0.76);}
  .tombstone.tombstone--1 + img {@apply -mt-2; }

  .tombstone.tombstone--2 {@apply mt-5 rotate-3 skew-x-3; filter: brightness(0.76);}
  .tombstone.tombstone--2 ~ span { @apply -mb-1;}

  .tombstone.tombstone--3 { @apply scale-90 -rotate-1 skew-x-3; }
  .tombstone.tombstone--3 + img { @apply scale-125; }

  .tombstone.tombstone--4 {@apply mt-2 transform scale-110 rotate-3; filter: brightness(0.7);}
  .tombstone.tombstone--4 + img { @apply scale-125; }
  .tombstone.tombstone--4 ~ span { @apply -mb-3; }

  .tombstone.tombstone--5 {@apply mt-3 transform rotate-1 skew-y-2; filter: brightness(0.76);}

  .tombstone.tombstone--6 {@apply mt-10 transform scale-110; filter: brightness(0.65);}

  .tombstone.tombstone--7 {@apply mt-4 transform; filter: brightness(0.65);}
  .tombstone.tombstone--7 + img { @apply -mt-4; }
</style>
