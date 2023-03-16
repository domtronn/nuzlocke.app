<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { parse, activeGame, savedGames, updateGame } from '$lib/store'

  import Toggle from '$lib/components/core/Toggle.svelte'
  import Radio from '$lib/components/core/Radio.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Settings } from '$icons'
  import { settingsData, settingsDefault } from './_data'

  let game, settingHash = settingsDefault, settings = []

  onMount(() => {
    parse(saves => {
      if (!browser) return
      game = saves[$activeGame]
      const s = (game.settings || settingsDefault).split('')

      settings = [...settingsData]
        .map(setting => ({ ...setting, state: +s[setting.index] }))
    })($savedGames)
  })

  $: settingHash = [...settings]
    .sort((a, b) => a.index - b.index)
    .map(i => +i.state).join('')

  $: if (game) {
    savedGames.update(updateGame({
      ...game,
      settings: settingHash
    }))
  }
</script>

<section class='max-w-sm mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl pb-2'>
  <h2 class='text-lg dark:text-gray-50 text-gray-900 font-bold flex justify-between'>
    Game settings
    <Icon inline={true} height=1.6em icon={Settings} class='fill-current inline-block' />
  </h2>

  <div class='h-px w-full my-4 dark:bg-gray-500 bg-gray-500' />

  <ul>
    {#each settings as s}
      <div class='mb-6 flex flex-0 justify-between items-center'>
        {#if s.options}
          <div>
            <h2 class='text-base dark:text-gray-50 text-gray-900 font-medium'>{s.name}</h2>
            <p class='mb-4 leading-4 dark:text-gray-500 text-gray-600 text-sm mr-4'>{s.help}</p>
          </div>
          <div>
            <Radio
              name={s.name}
              bind:selected={s.state}
              options={s.options}
              className='dark:text-gray-500 text-gray-600'
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
