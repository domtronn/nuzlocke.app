<script>
  export let id, created, name, game

  import { onMount, getContext } from 'svelte'
  import { activeGame, deleteGame, getGame, read, summarise } from '$lib/store'
  import { fade } from 'svelte/transition'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'
  import { PIcon, Button, IconButton, Picture } from '$lib/components/core'

  import Icon from 'svelte-icons-pack'
  import Bin from 'svelte-icons-pack/bi/BiTrash'
  import Share from 'svelte-icons-pack/ri/RiSystemShareForwardLine'

  let ShareModal
  onMount(_ => {
    import('$lib/components/qr/ShareModal.svelte').then(mod => ShareModal = mod.default)
  })

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

  const { open } = getContext('simple-modal')
  const onshare = _ => open(ShareModal, { id })

  $: date = day(+created).format('Do of MMM, YYYY')
</script>

<div class='transition cursor-pointer font-mono tracking-widest flex flex-row justify-between items-center md:gap-x-24'>
  <div out:fade on:click={onclick} class='group flex flex-col sm:flex-row gap-x-4 items-start md:items-center'>
    <Picture
      alt='{name} logo'
      src=/assets/{game}
      className='hidden sm:block w-32'
      aspect=192x96
    />

      <div>
        <h2 class='group-hover:text-yellow-400 transition text-2xl leading-6 mb-2'>{name}</h2>
        <h3 class='group-hover:text-yellow-400 font-sans text-xs transition -mt-1'>{date}</h3>
        <span class='font-sans inline-flex items-center'>
          {(available || []).length}
          <PIcon className='transition group-hover:grayscale-0 grayscale mr-2 -mt-1' type='item' name='poke-ball' />
          {(deceased || []).length}
          <Icon className='ml-1 fill-current' src={NuzlockeStates[5].icon} />
        </span>
      </div>
    </div>

  <div class='flex flex-col gap-y-2 md:flex-row md:gap-x-3 items-end md:items-center'>
    <Button
      rounded
      className=umami--click--delete-save
      on:click={ondelete}
    >
      Delete
      <Icon src={Bin} className='hidden sm:inline-block fill-current -mt-1' />
    </Button>

    <IconButton
      rounded
      color=orange
      src={Share}
      track=share-game
      title='Transfer save'
      on:click={onshare} />

  </div>
</div>
