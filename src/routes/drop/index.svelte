<script context=module>
  export const ssr = false
</script>

<script>
  /**
   * Drop 'endpoint' to read data and create a save file from it
   * redirects to the saves page once imported
   */

  import { page } from '$app/stores'
  import { savedGames, format, IDS } from '$lib/store'
  import { onMount } from 'svelte'

  const payload = JSON.parse($page.query.get('payload'))
  onMount(_ => {
    const save = payload.save
    const gamedata = JSON.stringify(payload.data)

    savedGames.subscribe(saves => {
      if (!saves)
        savedGames.set(format(save))
      else if (!saves.includes(save.id))
        savedGames.set(`${saves},${format(save)}`)

      localStorage.setItem(
        IDS.game(save.id),
        gamedata
      )

      window.location = '/saves'
    })
  })
</script>
