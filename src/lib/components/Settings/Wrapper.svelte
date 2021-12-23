<script>
  import { browser } from '$app/env'
  import { settingsDefault, getSetting } from './_data'
  import { parse, activeGame, savedGames } from '$lib/store'

  export let id, on = undefined, condition = true
  export let setting

  savedGames.subscribe(parse(saves => {
    const { settings } = saves[$activeGame] || {}
    setting = (settings || settingsDefault)[getSetting(id)]
  }))
</script>

{#if !on || (+setting === +on && condition)}
  <slot setting={+setting} />
{:else}
  <slot setting={+setting} name=else />
{/if}
