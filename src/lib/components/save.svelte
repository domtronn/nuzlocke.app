<script>
  export let id, created, name, game
  import { activeGame, getGame, read } from '$lib/store'
  import dayjs from 'dayjs'

  import { NuzlockeGroups, NuzlockeStates } from '$lib/data/states'

  import PIcon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'

  let pkmn = []
  let loading = true
  getGame(id).subscribe(read(data => {
    loading = false
    pkmn = Object.values(data)
  }))

  const onclick = _ => activeGame.set(id)

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
    </div>
  {/if}
