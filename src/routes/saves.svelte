<script>
  import { savedGames } from '$lib/store'

  let gameData = ''
  savedGames.subscribe(val => gameData = val)

  $: games = gameData
        .split(',')
        .filter(i => i)
        .map(s => s.split('|'))
        .map(([id, created, name, game]) => ({ id, created, name, game}))

</script>

<pre>
  {JSON.stringify(games, null, 2)}
</pre>
