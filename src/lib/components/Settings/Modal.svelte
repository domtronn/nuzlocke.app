<script>
  import { onMount, getContext } from 'svelte'
  import { browser } from '$app/environment'
  import { parse, activeGame, savedGames, updateGame } from '$lib/store'

  import Toggle from '$lib/components/core/Toggle.svelte'
  import Radio from '$lib/components/core/Radio.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Settings } from '$icons'
  import { getSetting, settingsData, settingsDefault } from './_data'

  import { Themes } from '$lib/data/colors.ts'

  import { IconButton, PIcon } from '$lib/components/core'
  import { X } from '$icons'

  let game, settingHash = settingsDefault, themeId = 0, Theme, settings = []

  const { close } = getContext('simple-modal')

  onMount(() => {
    parse(saves => {
      if (!browser) return
      game = saves[$activeGame]
      const s = (game.settings || '').split('')
      const sd = settingsDefault.split('')

      settings = [...settingsData]
        .map(setting => ({ ...setting, state: +(s?.[setting.index] || sd ?.[setting.index]) }))
    })($savedGames)
  })

  $: settingHash = [...settings]
      .sort((a, b) => a.index - b.index)
      .map(i => +i.state).join('')

  $: themeId = settingHash.split('')[getSetting('theme')]
  $: Theme = Object.fromEntries(
    Object
      .entries(Object.values(Themes)[themeId || 0])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(a => a[0] !== '???')
      .filter(a => !Array.isArray(a[1])))

  $: if (game) {
    savedGames.update(updateGame({
      ...game,
      settings: settingHash
    }))
  }
</script>

<section class='max-w-sm md:max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 p-6 md:p-8 rounded-2xl pb-2'>
  <h2 class='text-lg dark:text-gray-50 text-gray-900 font-bold flex justify-between'>
    <span>
      <Icon inline={true} icon={Settings} class='fill-current inline-block' />
      Game settings
    </span>

    <IconButton
      rounded borderless color=orange containerClassName=-mt-1
      src={X} on:click={close}
      tabIndex=3
      title='Close modal'
      />
  </h2>

  <div class='h-px w-full my-4 dark:bg-gray-500 bg-gray-500' />

  <ul class='flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 xl:gap-6'>
    {#each settings as s}
      <div
        style='--mdcol: 3; --lgcol: 3;'
        class='setting mb-2 flex flex-0 max-md:justify-between items-start w-full md:w-auto'
        class:md:justify-between={s.index !== 7}
        class:md:justify-normal={+s.index === 7}
        class:basis-full={+s.index === 7}
        class:md:order-10={+s.index === 7}
        >
        {#if s.options}
          <div>
            <h2 class='text-base dark:text-gray-50 text-gray-900 font-medium'>{s.name}</h2>
            <p
              class='mb-4 leading-4 dark:text-gray-500 text-gray-600 text-sm mr-4'
              >{s.help}</p>
            {#if +s.index === 7 && (Object.keys(Theme || {}).length)}
              <div class='flex flex-row flex-wrap -mt-2 max-w-[220px] md:max-w-[360px]'>
                {#each Object.entries(Theme) as [type, hex], i}
                  <div style='background: {hex};' class='w-6 h-6 md:w-10 md:h-10 flex items-center justify-center'>
                    <PIcon type=symbol className='transform max-md:scale-75 mix-blend-screen' name='type-{type}-32px' />
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
              className='dark:text-gray-500 text-gray-600 {s.index === 7 ? 'md:mt-1' : ''}'
            />
          </div>
        {:else}
          <Toggle id={s.id} bind:state={s.state}>
            <h2 class='text-base dark:text-gray-50 text-gray-900 font-medium'>{s.name}</h2>
            <p class='leading-4 dark:text-gray-500 text-gray-600 text-sm mr-4'>{s.help}</p>
          </Toggle>
        {/if}
      </div>
    {/each}
  </ul>
</section>

<style>
  .setting {
    width: 100%;
  }
  @media (min-width: theme('screens.md')) {
    .setting {
      width: calc((100% / var(--mdcol)) - (((var(--mdcol) - 1) / var(--mdcol)) * 1rem) );
    }
  }
  @media (min-width: theme('screens.xl')) {
    .setting {
      width: calc((100% / var(--lgcol)) - (((var(--lgcol) - 1) / var(--lgcol)) * 1.5rem) );
    }
  }
</style>
