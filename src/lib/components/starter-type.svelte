<script>
  export let starter, key
  import { createEventDispatcher } from 'svelte'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  import { PIcon } from '$c/core'
  import { Fire, Water, Grass } from '$icons'

  let starters = [
    { name: 'fire', icon: Fire },
    { name: 'water', icon: Water },
    { name: 'grass', icon: Grass }
  ]

  const minimal = key.startsWith('unbound')

  if (key.startsWith('unbound')) {
    starters = [
      { col: 'dragon', name: 'fire', picon: 'gible' },
      { col: 'steel', name: 'water', picon: 'beldum' },
      { col: 'ground', name: 'grass', picon: 'larvitar' },
    ]
  }

  const dispatch = createEventDispatcher()
  const setstarter = (value) => _ => dispatch('select', { value })
</script>

<SettingWrapper id=theme let:setting={themeId}>
{#each starters as s, i}
  <label
    class='flex w-6 h-6 p-1 items-center justify-center rounded-full cursor-pointer transition border-2'
    class:opacity-50={starter !== s.name}
    class:hover:opacity-75={starter !== s.name}
    class:opacity-100={starter === s.name}
    class:border-gray-700={minimal}
    class:bg-gray-700={minimal}
    style='{starter === s.name ? 'background-color: ' + color(s.col || s.name, themeId) : ''}; {!minimal || starter === s.name ? 'border-color: ' + color(s.col || s.name, themeId) : ''}'
  >
    <input type='radio' on:click={setstarter(s.name)} name='starter' value={s.name} />
    {#if s.icon}
      <Icon inline={true} icon={s.icon} color={starter === s.name ? 'white' : color(s.col || s.name, themeId)} />
    {/if}
    {#if s.picon}
      <PIcon class='mix-blend-luminosity w-8 h-8' name={s.picon} />
    {/if}
  </label>
{/each}
</SettingWrapper>

<style lang="postcss">
  input { display: none; }
</style>
