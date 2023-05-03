<script>
  import { settingsDefault } from '$c/Settings'

  export let id,
    created,
    updated = -1,
    name,
    game,
    attempts = -1,
    settings = settingsDefault

  import { fade } from 'svelte/transition'
  import { onMount, getContext } from 'svelte'
  import {
    activeGame,
    deleteGame,
    getGame,
    read,
    readdata,
    summarise,
    IDS
  } from '$lib/store'
  import day from '$lib/utils/date'

  import { NuzlockeStates } from '$lib/data/states'
  import { Bin, Download, Share } from '$icons'
  import { Icon, PIcon, IconButton, Logo as Picture } from '$c/core'

  let ShareModal
  onMount((_) => {
    import('$lib/components/qr/ShareModal.svelte').then(
      (mod) => (ShareModal = mod.default)
    )
  })

  let team, available, deceased
  getGame(id).subscribe(
    read(
      summarise((data) => {
        team = data.team || []
        available = data.available || []
        deceased = data.deceased || []
      })
    )
  )

  const ondelete = (_) => deleteGame(id)
  const onclick = (_) => {
    activeGame.set(id)
    window.location = '/game'
  }

  let downloadAnchor
  const ondownload = (_) => {
    const gameData = window.localStorage.getItem(IDS.game(id))
    const meta = {
      name,
      attempts,
      game,
      id,
      settings,
      created,
      updated
    }

    const data =
      `text/json;charset=utf-8,` +
      encodeURIComponent(
        JSON.stringify({ __meta: meta, ...JSON.parse(gameData || '{}') })
      )
    downloadAnchor.setAttribute('href', 'data:' + data)
    downloadAnchor.setAttribute('download', `Nuzlocke Tracker - ${name}.nzsav`)
  }

  const { open } = getContext('simple-modal')
  const onshare = (_) => open(ShareModal, { id })

  $: date = day(+created).format('Do of MMMM')
  $: last = updated > created ? day(+updated).format('Do of MMMM') : null
</script>

<div
  class="flex flex-col items-start justify-between tracking-widest transition md:flex-row md:items-center"
>
  <button
    title="Load saved game {name}"
    class="flex-start group relative flex flex-1 cursor-pointer flex-col items-start gap-x-4 sm:flex-row md:items-center md:pr-24"
    out:fade
    on:click={onclick}
  >
    <Picture
      alt="{name} logo"
      src="/assets/{game}"
      class="hidden h-16 w-32 sm:block"
      aspect="192x96"
    />

    <div class="text-left">
      <h2 class="max-w-[26ch] text-xl font-bold leading-7 transition">
        <mark
          class="bg-transparent transition group-hover:bg-yellow-300 dark:text-gray-50 dark:group-hover:text-gray-900"
        >
          {name}
          {#if attempts > 1}
            <div
              class="inline-block -translate-y-0.5 text-xs font-normal italic opacity-50"
            >
              (Attempt {attempts})
            </div>
          {/if}
        </mark>
      </h2>

      <h3 class="text-sm transition">
        <mark
          class="bg-transparent transition group-hover:bg-yellow-300 dark:text-gray-50 dark:group-hover:text-gray-900"
          >{date}</mark
        >
        {#if last}
          <span> - </span>
          <mark
            class="bg-transparent transition group-hover:bg-yellow-300 dark:text-gray-50 dark:group-hover:text-gray-900"
            >{last}</mark
          >
        {/if}
      </h3>

      <span
        class="inline-flex items-center font-sans transition group-hover:grayscale-0 md:grayscale"
      >
        <PIcon className=" -mt-0.5 -ml-1" type="item" name="poke-ball" />
        {(available || []).length}
        <Icon
          inline={true}
          class="ml-3 mr-2 fill-current"
          icon={NuzlockeStates[5].icon}
        />
        {(deceased || []).length}

        <span class="mr-4" />

        {#each team as icon}
          <div class="relative h-8 w-8">
            <PIcon
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              name={icon}
            />
          </div>
        {/each}
      </span>
    </div>
  </button>

  <div class="flex flex-row items-end gap-3 max-md:mt-2 md:items-center">
    <IconButton
      rounded
      color="yellow"
      src={Bin}
      title="Delete save"
      on:click={ondelete}
    />

    <a bind:this={downloadAnchor}>
      <IconButton
        rounded
        color="yellow"
        src={Download}
        title="Download save"
        on:click={ondownload}
      />
    </a>

    <IconButton
      rounded
      color="yellow"
      src={Share}
      title="Transfer save"
      on:click={onshare}
    />
  </div>
</div>
