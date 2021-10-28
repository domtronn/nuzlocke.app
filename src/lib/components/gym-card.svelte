<script>
  export let pokemon, name, speciality;

  const levelCap = pokemon.reduce((acc, it) => Math.max(acc, it.level), 0)
  const teamCap = pokemon.length
  const maxStat = pokemon.reduce((acc, it) => Math.max(acc, Math.max(...Object.values(it.stats))), 0)

  const threshold = -15

  const atkMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class !== 'status').length, 0)
  const physMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'physical').length, 0)
  const specMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'special').length, 0)

  const aggStats = pokemon.reduce((acc, it, i, arr) => ({
    spdef: (acc.spdef || []).concat(it.stats.spdef),
    def: (acc.def || []).concat(it.stats.def),
    spatk: (acc.spatk || []).concat(it.stats.spatk),
    atk: (acc.atk || []).concat(it.stats.atk),
  }), {})

  const stats = Object
    .entries(aggStats)
    .map(([key, vals]) => [
      key, {
        min: Math.min(...vals),
        max: Math.max(...vals),
        avg: vals.reduce((acc, it) => acc + it, 0) / vals.length
      }
    ])
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

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

{#if stats.def.avg - stats.spdef.avg <= threshold}
  <p>Recommend using a <b>Physical attacker</b> since their <code>def</code> is a weakness.</p>
{:else if stats.spdef.avg - stats.def.avg <= threshold}
  <p>Recommend using a <b>Special attacker</b> since their <code>spdef</code> is a weakness.</p>
{:else}
  <p>Recommend using a <b>mixture</b> as their defenses are balanced.</p>
{/if}

{#if stats.atk.avg - stats.spatk.avg <= threshold}
  <p>Their team is strong <b>Special attackers</b>.</p>
{:else if stats.spatk.avg - stats.atk.avg <= threshold}
  <p>Their team is strong <b>Physical attackers</b>.</p>
{:else}
  <p>Their team uses <b>mixed</b> attackers.</p>
{/if}

{#if (physMoves / atkMoves) > 0.5}
  <p>With most of their attacks being <b>physical</b> ({Math.round(physMoves / atkMoves * 100)}%).</p>
{:else if (specMoves / atkMoves) > 0.5}
  <p>With most of their attacks being <b>special</b> ({Math.round(specMoves / atkMoves * 100)}%).</p>
{/if}

    </span>

  <div slot='item' class='grid lg:grid-cols-3 md:grid-cols-2 mt-8 gap-x-6 gap-y-10'>
    {#each pokemon as p}
      <Pokemon {...p} maxStat={maxStat} />
    {/each}
  </div>

  </Accordion>
</div>
