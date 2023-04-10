<script>
  export let id, created, updated = -1, name, game, attempts = -1

  import { onMount, getContext } from 'svelte'
  import { activeGame, deleteGame, getGame, read, summarise } from '$lib/store'
  import { fade } from 'svelte/transition'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'
  import { PIcon, IconButton, Logo as Picture } from '$lib/components/core'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Bin } from '$icons'
  import { Share } from '$icons'

  let ShareModal
  onMount(_ => {
    import('$lib/components/qr/ShareModal.svelte').then(mod => ShareModal = mod.default)
  })

  let team, available, deceased
  getGame(id).subscribe(read(summarise(data => {
    team = data.team || []
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
  $: last = updated > created ? day(+updated).format('Do of MMM, YYYY') : null
</script>

<div class='transition tracking-widest flex flex-row justify-between items-center'>
  <button title='Load saved game {name}'
          class='group flex flex-col flex-1 sm:flex-row gap-x-4 flex-start items-start md:items-center cursor-pointer md:pr-24'
          out:fade on:click={onclick}>
    <Picture
      alt='{name} logo'
      src=/assets/{game}
      class='hidden sm:block h-16 w-32'
      aspect=192x96
    />

    <div class='text-left'>
      <h2 class='font-bold transition text-xl leading-7 max-w-[26ch]'>
        <mark class='bg-transparent dark:text-gray-50 dark:group-hover:text-gray-900 transition group-hover:bg-yellow-300'>
          {name}
          {#if attempts > 1}
            <div class='opacity-50 italic font-normal text-xs -translate-y-0.5 inline-block'>
              (Attempt {attempts})
            </div>
            {/if}
        </mark>
      </h2>

      <h3 class='text-sm transition'>
        <mark class='bg-transparent dark:text-gray-50 dark:group-hover:text-gray-900 transition group-hover:bg-yellow-300'>{date}</mark>
        {#if last}
          <span> - </span>
          <mark class='bg-transparent dark:text-gray-50 dark:group-hover:text-gray-900 transition group-hover:bg-yellow-300'>{last}</mark>
        {/if}
      </h3>

      <span class='transition group-hover:grayscale-0 grayscale font-sans inline-flex items-center'>

        <PIcon className=' -mt-0.5 -ml-1' type='item' name='poke-ball' />
        {(available || []).length}
        <Icon inline={true} class='ml-3 mr-2 fill-current' icon={NuzlockeStates[5].icon} />
        {(deceased || []).length}

        <span class='mr-4' />

        {#each team as icon}
          <div class='w-8 h-8 relative'>
            <PIcon class='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' name={icon} />
          </div>
        {/each}
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
