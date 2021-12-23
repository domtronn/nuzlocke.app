<script>
  import { browser } from '$app/env'
  import { settingsDefault, getSetting } from './_data'
  import { parse, activeGame, savedGames } from '$lib/store'

  export let id, on = 1, condition = true
  let setting

  savedGames.subscribe(parse(saves => {
    const { settings = settingsDefault} = saves[$activeGame] || {}
    setting = settings[getSetting(id)]
  }))
</script>

{#if +setting === +on && condition}
  <slot />
{:else}
  <slot name=else />
{/if}
