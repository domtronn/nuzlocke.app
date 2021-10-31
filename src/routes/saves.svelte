<script>
  import { savedGames } from '$lib/store'
  import Save from '$lib/components/save.svelte'

  let gameData = ''
  savedGames.subscribe(val => gameData = val)

  $: games = gameData
    .split(',')
    .filter(i => i)
    .map(s => s.split('|'))
    .map(([id, created, name, game]) => ({ id, created, name, game}))
</script>

{#each games as game (game.id)}
  <Save {...game} />
{/each}
