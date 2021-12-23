<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/env'
  import { parse, activeGame, savedGames, updateGame } from '$lib/store'

  import Toggle from '$lib/components/core/Toggle.svelte'
  import Radio from '$lib/components/core/Radio.svelte'

  import Icon from 'svelte-icons-pack'
  import Settings from 'svelte-icons-pack/vsc/VscSettings'
  import { settingsData, settingsDefault } from './_data'

  let settings = [...settingsData]
  let game, settingHash = settingsDefault
  onMount(() => {
    parse(saves => {
      if (!browser) return
      game = saves[$activeGame]
      const s = (game.settings || settingsDefault).split('')
      settings = settings.map((setting, i) => ({ ...setting, state: +s[i] }))
    })($savedGames)
  })

  $: settingHash = settings.map(i => +i.state).join('')
  $: settings, savedGames.update(updateGame({
    ...game,
    settings: settingHash
  }))
</script>

<div class='max-w-xs mx-auto'>
  <h2 class='text-lg dark:text-gray-50 text-gray-900 font-bold flex justify-between'>
    Game settings
    <Icon size=1.6em src={Settings} className='fill-current inline-block' />
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
</div>
