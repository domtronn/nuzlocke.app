<script>
  export let className = ''
  import { activeGame, savedGames, getGame, read, parse } from '$lib/store'

  let game = {}
  activeGame.subscribe(id => {
    savedGames.subscribe(parse(games => {
      game = games[id]
    }))
  })
</script>


<span class='{className} inline-flex items-center -ml-4'>
  <img src='/assets/{game.game}.png' alt={game.game + ' logo'} class='h-28 mr-6' />
  <h1 class='text-3xl'>
    {game.name}
  </h1>
</span>
