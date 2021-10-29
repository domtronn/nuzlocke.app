<script>
 export let game, id
 let pokemon = [], name = '', speciality = ''

 import { onMount } from 'svelte'
 import Pokemon from '$lib/components/pokemon-card.svelte'
 import TypeBadge from '$lib/components/type-badge.svelte'
 import Label from '$lib/components/label.svelte'
 import Accordion from '$lib/components/accordion.svelte'

 import Icon from 'svelte-icons-pack'
 import Info from 'svelte-icons-pack/ri/RiEditorAsterisk'

 onMount(async () => {
   const res = await fetch(`/leader/${game}/${id}.json`)
   const data = await res.json()

   pokemon = data.pokemon
   name = data.name
   speciality = data.speciality
 })

 $: levelCap = pokemon.reduce((acc, it) => Math.max(acc, it.level), 0)
 $: teamCap = pokemon.length
 $: maxStat = pokemon.reduce((acc, it) => Math.max(acc, Math.max(...Object.values(it.stats))), 0)

 const threshold = -15

 $: atkMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class !== 'status').length, 0)
 $: physMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'physical').length, 0)
 $: specMoves = pokemon.reduce((acc, it) => acc + it.moves.filter(i => i.damage_class === 'special').length, 0)

 $: aggStats = pokemon.reduce((acc, it, i, arr) => ({
   spdef: (acc.spdef || []).concat(it.stats.spdef),
   def: (acc.def || []).concat(it.stats.def),
   spatk: (acc.spatk || []).concat(it.stats.spatk),
   atk: (acc.atk || []).concat(it.stats.atk),
 }), { spdef: [], def: [], spatk: [], atk: [] })

 $: stats = Object
   .entries(aggStats)
   .map(([key, vals]) => [
     key, {
       min: Math.min(...vals),
       max: Math.max(...vals),
       avg: vals.reduce((acc, it) => acc + it, 0) / vals.length
     }
   ])
   .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

 let msg = []
 $: {
   msg = []
   if (stats.def.avg - stats.spdef.avg <= threshold)
     msg.push('Recommend using a Physical attacker since their def is a weakness.')
   else if (stats.spdef.avg - stats.def.avg <= threshold)
     msg.push('Recommend using a Special attacker since their spd is a weakness.')
   else
     msg.push('Recommend using a mixture as their defenses are balanced.')



   if (stats.atk.avg - stats.spatk.avg <= threshold)
     msg.push('Their team is strong Special attackers.')
   else if (stats.spatk.avg - stats.atk.avg <= threshold)
     msg.push('Their team is strong Physical attackers.')
   else
     msg.push('Their team uses mixed attackers.')

   if ((physMoves / atkMoves) > 0.5)
     msg.push(`With most of their attacks being physical (${Math.round(physMoves / atkMoves * 100)}%).`)
   else if ((specMoves / atkMoves) > 0.5)
     msg.push(`With most of their attacks being special (${Math.round(specMoves / atkMoves * 100)}%).`)
 }
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
        <span data-tooltip={msg.join('\n')}>
          <Icon src={Info} className="fill-current text-gray-400" />
        </span>
        <Label heading='Lvl cap' body={levelCap} />
        <Label heading='Team' body={teamCap} />
      </div>

      {#if speciality}
        <h2 class='text-md font-medium'>The {speciality} gym</h2>
      {/if}
    </span>

    <div slot='item' class='grid lg:grid-cols-2 md:grid-cols-2 mt-8 gap-x-6 gap-y-10'>
      {#each pokemon as p}
        <Pokemon {...p} maxStat={maxStat} />
      {/each}
    </div>

  </Accordion>
</div>
