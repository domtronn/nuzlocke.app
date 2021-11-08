<script>
  export let id, created, name, game

  import { activeGame, deleteGame, getGame, read, summarise } from '$lib/store'
  import { fade } from 'svelte/transition'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'

  import PIcon from '$lib/components/pokemon-icon.svelte'
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
      <img
        alt='{name} logo'
        src='/assets/{game}.png'
        class='w-16 group-hover:grayscale-0 grayscale transition hidden md:block'
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
      <button
        class='font-sans text-xs dark:bg-transparent dark:text-gray-300 dark:border-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-400 dark:hover:active:bg-indigo-900 bg-white inline-flex items-center gap-x-2 hover:active:bg-yellow-50 shadow-md text-gray-500 border-gray-400 active:shadow-sm active:text-yellow-600 hover:active:border-yellow-600 hover:text-yellow-300 hover:border-yellow-200 rounded-lg px-2 py-1 transition-all border-2'
        on:click={ondelete}
        >
        Delete
        <Icon src={Bin} className='fill-current' />
      </button>
    </div>
</div>
