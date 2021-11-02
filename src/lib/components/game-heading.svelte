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
  <img src='/data/{game.game}.png' class='w-28 h-28' />
  <h1 class='text-3xl'>
    {game.name}
  </h1>
</span>
