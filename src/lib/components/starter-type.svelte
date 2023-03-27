<script>
  export let starter, key
  import { createEventDispatcher } from 'svelte'

  import Colors from '$lib/data/colors.json'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  import { PIcon } from '$c/core'
  import { Fire, Water, Grass } from '$icons'

  let starters = [
    { col: Colors.fire, name: 'fire', icon: Fire },
    { col: Colors.water, name: 'water', icon: Water },
    { col: Colors.grass, name: 'grass', icon: Grass }
  ]

  const minimal = key.startsWith('unbound')

  if (key.startsWith('unbound')) {
    starters = [
      { col: Colors.dragon, name: 'fire', picon: 'gible' },
      { col: Colors.steel, name: 'water', picon: 'beldum' },
      { col: Colors.ground, name: 'grass', picon: 'larvitar' },
    ]
  }

  const dispatch = createEventDispatcher()
  const setstarter = (value) => _ => dispatch('select', { value })
</script>

{#each starters as s, i}
  <label
    class='flex w-6 h-6 p-1 items-center justify-center rounded-full cursor-pointer transition border-2'
    class:opacity-50={starter !== s.name}
    class:hover:opacity-75={starter !== s.name}
    class:opacity-100={starter === s.name}
    class:border-gray-700={minimal}
    class:bg-gray-700={minimal}
    style='{starter === s.name ? 'background-color: ' + s.col : ''}; {!minimal || starter === s.name ? 'border-color: ' + s.col : ''}'
  >
    <input type='radio' on:click={setstarter(s.name)} name='starter' value={s.name} />
    {#if s.icon}
      <Icon inline={true} icon={s.icon} color={starter === s.name ? 'white' : s.col} />
    {/if}
    {#if s.picon}
      <PIcon class='mix-blend-luminosity w-8 h-8' name={s.picon} />
    {/if}
  </label>
{/each}

<style lang="postcss">
  input { display: none; }
</style>
