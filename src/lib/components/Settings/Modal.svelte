<script>
  import { onMount, getContext } from 'svelte'
  import { browser } from '$app/environment'
  import {
    parse,
    patch,
    readdata,
    activeGame,
    savedGames,
    updateGame,
    getGameStore
  } from '$lib/store'

  import { Toggle, Radio, Button, Icon, IconButton, PIcon } from '$c/core'
  import { Settings, X } from '$icons'

  import { getSetting, settingsData, settingsDefault } from './_data'
  import { Themes } from '$lib/data/colors.ts'

  let game,
    settingHash = settingsDefault,
    themeId = 0,
    Theme,
    settings = []

  const { close } = getContext('simple-modal')

  onMount(() => {
    parse((saves) => {
      if (!browser) return
      game = saves[$activeGame]
      const s = (game.settings || '').split('')
      const sd = settingsDefault.split('')

      settings = [...settingsData].map((setting) => ({
        ...setting,
        state: +(s?.[setting.index] || sd?.[setting.index])
      }))
    })($savedGames)
  })

  $: settingHash = [...settings]
    .sort((a, b) => a.index - b.index)
    .map((i) => +i.state)
    .join('')

  $: themeId = settingHash.split('')[getSetting('theme')]
  $: Theme = Object.fromEntries(
    Object.entries(Object.values(Themes)[themeId || 0])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter((a) => a[0] !== '???')
      .filter((a) => !Array.isArray(a[1]))
  )

  $: if (game) {
    savedGames.update(
      updateGame({
        ...game,
        settings: settingHash
      })
    )
  }

  const reset = () => {
    const [, , id] = readdata()
    const gameStore = getGameStore(id)
    const resetCopy =
      "This will reset all data for this run, including your encounters, team & box. You cannot recover this data when it's reset. Are you sure?"
    if (window.confirm(resetCopy)) gameStore.set('{}')
  }

  const resethidden = () => {
    const [, , id] = readdata()
    const gameStore = getGameStore(id)
    const resetCopy = 'This will redisplay all hidden locations. Are you sure?'
    if (window.confirm(resetCopy)) gameStore.update(patch({ __hidden: [] }))
  }
</script>

<section
  class="mx-auto max-w-sm rounded-2xl bg-gray-50 p-6 dark:bg-gray-900 md:max-w-4xl md:p-8"
>
  <h2
    class="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-50"
  >
    <span>
      <Icon inline={true} icon={Settings} class="inline-block fill-current" />
      Game settings
    </span>

    <IconButton
      rounded
      borderless
      color="orange"
      containerClassName="-mt-1"
      src={X}
      on:click={close}
      tabIndex="3"
      title="Close modal"
    />
  </h2>

  <div class="my-4 h-px w-full bg-gray-500 dark:bg-gray-500" />

  <ul class="flex flex-col flex-wrap gap-2 md:flex-row md:gap-4 xl:gap-6">
    {#each settings as s}
      <div
        style="--mdcol: 3; --lgcol: 3;"
        class="setting flex-0 mb-2 flex w-full items-start max-md:justify-between md:w-auto"
        class:md:justify-between={s.index !== 7}
        class:md:justify-normal={+s.index === 7}
        class:basis-full={+s.index === 7}
        class:md:order-10={+s.index === 7}
      >
        {#if s.options}
          <div>
            <h2 class="text-base font-medium text-gray-900 dark:text-gray-50">
              {s.name}
            </h2>
            <p
              class="mb-4 mr-4 text-sm leading-4 text-gray-600 dark:text-gray-500"
            >
              {s.help}
            </p>
            {#if +s.index === 7 && Object.keys(Theme || {}).length}
              <div
                class="-mt-2 flex max-w-[220px] flex-row flex-wrap md:max-w-[360px]"
              >
                {#each Object.entries(Theme) as [type, hex], i}
                  <div
                    style="background: {hex};"
                    class="flex h-6 w-6 items-center justify-center md:h-10 md:w-10"
                  >
                    <PIcon
                      type="symbol"
                      className="transform max-md:scale-75 mix-blend-screen"
                      name="type-{type}-32px"
                    />
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          <div>
            <Radio
              name={s.name}
              bind:selected={s.state}
              options={s.options}
              className="dark:text-gray-500 text-gray-600 {s.index === 7
                ? 'md:mt-1'
                : ''}"
            />
          </div>
        {:else}
          <Toggle id={s.id} bind:state={s.state}>
            <h2 class="text-base font-medium text-gray-900 dark:text-gray-50">
              {s.name}
            </h2>
            <p class="mr-4 text-sm leading-4 text-gray-600 dark:text-gray-500">
              {s.help}
            </p>
          </Toggle>
        {/if}
      </div>
    {/each}
  </ul>

  <div class="mt-2 h-px w-full bg-gray-500 dark:bg-gray-500" />

  <div class="mt-4 flex w-full justify-end gap-x-4">
    <Button on:click={reset} rounded>Reset Run</Button>
    <Button on:click={resethidden} rounded>Reset Hidden locations</Button>
  </div>
</section>
<div class="block h-48 md:hidden" />

<style>
  .setting {
    width: 100%;
  }
  @media (min-width: theme('screens.md')) {
    .setting {
      width: calc(
        (100% / var(--mdcol)) - (((var(--mdcol) - 1) / var(--mdcol)) * 1rem)
      );
    }
  }
  @media (min-width: theme('screens.xl')) {
    .setting {
      width: calc(
        (100% / var(--lgcol)) - (((var(--lgcol) - 1) / var(--lgcol)) * 1.5rem)
      );
    }
  }
</style>
