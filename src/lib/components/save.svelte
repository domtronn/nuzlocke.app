<script>
  export let id, created, name, game
  import { activeGame, deleteGame, getGame, read } from '$lib/store'
  import dayjs from 'dayjs'

  import { NuzlockeGroups, NuzlockeStates } from '$lib/data/states'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Bin from 'svelte-icons-pack/bi/BiTrash'

  let pkmn = []
  let loading = true
  getGame(id).subscribe(read(data => {
    loading = false
    pkmn = Object.values(data)
  }))

  const onclick = _ => activeGame.set(id)
  const ondelete = _ => deleteGame(id)

  $: date = dayjs(+created).format('DD MM YYYY')
  $: available = pkmn.filter(i => !i.status || NuzlockeGroups.Available.includes(i?.status))
  $: deceased = pkmn.filter(i => NuzlockeGroups.Dead.includes(i?.status))

</script>

{#if loading}
  {:else}
    <div on:click={onclick}>
      <h2>{name}</h2>
      <h3>Created {date}</h3>
      <span class='inline-flex'>
        {available.length}
        <PIcon type='item' name='poke-ball' />
        {deceased.length}
        <Icon src={NuzlockeStates[5].icon} />
      </span>

      <button
        class='bg-white hover:active:bg-indigo-50 shadow-md text-gray-400 border-gray-200 active:shadow-sm active:text-indigo-600 hover:active:border-indigo-600 hover:text-indigo-300 hover:border-indigo-200 rounded-lg p-2 transition-all border-2'
        on:click={ondelete}
      >
        <Icon src={Bin} className='fill-current' />
      </button>

    </div>
  {/if}
