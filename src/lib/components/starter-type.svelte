<script>
  export let starter
  import { createEventDispatcher } from 'svelte'

  import Colors from '$lib/data/colors.json'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Fire, Water, Grass } from '$icons'

  const starters = [
    { col: Colors.fire, name: 'fire', icon: Fire },
    { col: Colors.water, name: 'water', icon: Water },
    { col: Colors.grass, name: 'grass', icon: Grass }
  ]

  const dispatch = createEventDispatcher()
  const setstarter = (value) => _ => dispatch('select', { value })
</script>

{#each starters as s, i}
  <label
    class='flex w-6 h-6 p-1 items-center justify-center rounded-full cursor-pointer transition border-2'
    class:opacity-50={starter !== s.name}
    class:hover:opacity-75={starter !== s.name}
    class:opacity-100={starter === s.name}
    style='{starter === s.name ? 'background-color: ' + s.col : ''}; border-color: {s.col}'
  >
    <input type='radio' on:click={setstarter(s.name)} name='starter' value={s.name} />
    <Icon inline={true} icon={s.icon} color={starter === s.name ? 'white' : s.col} />
  </label>
{/each}

<style lang="postcss">
  input { display: none; }
</style>
