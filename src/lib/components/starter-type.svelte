<script>
  export let starter
  import { createEventDispatcher } from 'svelte'

  import Colors from '$lib/data/colors.json'
  import Icon from 'svelte-icons-pack'
  import Water from 'svelte-icons-pack/io/IoWater'
  import Fire from 'svelte-icons-pack/im/ImFire'
  import Grass from 'svelte-icons-pack/fa/FaSolidLeaf'

  const starters = [
    { col: Colors.fire, name: 'fire', icon: { ...Fire, c: Fire.c.replace(/fill="#000000"/g, '') } },
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
    <Icon src={s.icon} color={starter === s.name ? 'white' : s.col} />
  </label>
{/each}

<style>
  input { display: none; }
</style>
