<script>
  export let pokemon, name, speciality;

  const levelCap = pokemon.reduce((acc, it) => Math.max(acc, it.level), 0)
  const teamCap = pokemon.length
  const maxStat = pokemon.reduce((acc, it) => Math.max(acc, Math.max(...Object.values(it.stats))), 0)

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'
  import Accordion from '$lib/components/accordion.svelte'
</script>

<div class='m-6 relative'>
  <Accordion>
    <span slot='heading' class='text-left'>
      <span class='inline-flex gap-x-2'>
        <h1 class='text-xl font-medium'>{name}</h1>
        {#if speciality}
          <div><TypeBadge type={speciality} /></div>
        {/if}
      </span>

      <div class='absolute top-0 right-0 inline-flex gap-x-2'>
        <Label heading='Lvl cap' body={levelCap} />
        <Label heading='Team cap' body={teamCap} />
      </div>

      {#if speciality}
        <h2 class='text-md font-medium'>The {speciality} gym</h2>
      {/if}
    </span>

  <div slot='item' class='grid lg:grid-cols-3 md:grid-cols-2 mt-8 gap-x-6 gap-y-10'>
    {#each pokemon as p}
      <Pokemon {...p} maxStat={maxStat} />
    {/each}
  </div>

  </Accordion>
</div>
