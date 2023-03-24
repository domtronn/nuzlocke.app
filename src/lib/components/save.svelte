<script>
  export let id, created, name, game

  import { onMount, getContext } from 'svelte'
  import { activeGame, deleteGame, getGame, read, summarise } from '$lib/store'
  import { fade } from 'svelte/transition'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'
  import { PIcon, IconButton, Picture } from '$lib/components/core'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Bin } from '$icons'
  import { Share } from '$icons'

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

<div class='transition tracking-widest flex flex-row justify-between items-center'>
  <button title='Load saved game {name}'
          class='group flex flex-col flex-1 sm:flex-row gap-x-4 flex-start items-start md:items-center cursor-pointer md:pr-24'
          out:fade on:click={onclick}>
    <Picture
      alt='{name} logo'
      src=/assets/{game}
      className='hidden sm:block w-32'
      aspect=192x96
    />

    <div class='text-left'>
      <h2 class='font-bold transition text-xl leading-7 max-w-[26ch]'><mark class='bg-transparent dark:text-gray-50 dark:group-hover:text-gray-900 transition group-hover:bg-yellow-300'>{name}</mark></h2>
      <h3 class='text-sm transition'><mark class='bg-transparent dark:text-gray-50 dark:group-hover:text-gray-900 transition group-hover:bg-yellow-300'>{date}<mark></h3>
      <span class='font-sans inline-flex items-center'>
        {(available || []).length}
        <PIcon className='transition group-hover:grayscale-0 grayscale mr-2 -mt-1' type='item' name='poke-ball' />
        {(deceased || []).length}
        <Icon inline={true} class='ml-1 fill-current' icon={NuzlockeStates[5].icon} />
      </span>
    </div>
  </button>

  <div class='flex flex-col gap-y-2 md:flex-row md:gap-x-3 items-end md:items-center'>
    <IconButton
      rounded
      color=yellow
      src={Bin}
      title='Delete save'
      on:click={ondelete} />

    <IconButton
      rounded
      color=yellow
      src={Share}
      title='Transfer save'
      on:click={onshare} />

  </div>
</div>
