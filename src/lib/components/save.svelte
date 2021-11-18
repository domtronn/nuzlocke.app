<script>
  export let id, created, name, game

  import { activeGame, deleteGame, getGame, read, summarise } from '$lib/store'
  import { fade } from 'svelte/transition'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'
  import { PIcon, Button, Picture } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Bin from 'svelte-icons-pack/bi/BiTrash'

  let available, deceased
  getGame(id).subscribe(read(summarise(data => {
    available = data.available || []
    deceased = data.deceased || []
  })))

  const ondelete = _ => deleteGame(id)
  const onclick = _ => {
    activeGame.set(id)
    window.location = '/game'
  }

  $: date = day(+created).format('Do of MMM, YYYY')
</script>

<div class='transition cursor-pointer font-mono tracking-widest flex flex-row justify-between items-center md:gap-x-24'>
  <div out:fade on:click={onclick} class='group flex flex-col sm:flex-row gap-x-4 items-start md:items-center'>
    <Picture
      alt='{name} logo'
      src=/assets/{game}
      className='hidden sm:block'
      aspect=72x72
    />

      <div>
        <h2 class='group-hover:text-yellow-400 transition text-2xl'>{name}</h2>
        <h3 class='group-hover:text-yellow-400 font-sans text-xs transition -mt-1'>{date}</h3>
        <span class='font-sans inline-flex items-center'>
          {(available || []).length}
          <PIcon className='transition group-hover:grayscale-0 grayscale mr-2 -mt-1' type='item' name='poke-ball' />
          {(deceased || []).length}
          <Icon className='ml-1 fill-current' src={NuzlockeStates[5].icon} />
        </span>
      </div>
    </div>

  <div class='flex flex-col items-end'>
    <Button
      rounded
      on:click={ondelete}
    >
      Delete
      <Icon src={Bin} className='hidden sm:inline-block fill-current -mt-1' />
    </Button>
  </div>
</div>
