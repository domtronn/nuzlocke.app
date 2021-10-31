<script>
  import { savedGames } from '$lib/store'

  // TODO: No saves and back button

  import Save from '$lib/components/save.svelte'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import Icon from 'svelte-icons-pack'
  import Floppy from 'svelte-icons-pack/im/ImFloppyDisk'

  let gameData = ''
  savedGames.subscribe(val => gameData = val)

  $: games = gameData
  .split(',')
  .filter(i => i)
  .map(s => s.split('|'))
  .map(([id, created, name, game]) => ({ id, created, name, game}))
</script>

<div class='container mx-auto h-screen items-center justify-center flex'>
  <main class='flex mx-auto'>
    <PixelatedContainer width='.2rem' className='flex flex-col px-6 gap-y-5'>
      <span class='flex justify-between items-center'>
        <h1 class='text-2xl'>Load save file</h1>
        <Icon src={Floppy} size='1.4em' />
      </span>

      <hr />
      <div transition:slide={{ duration: 300 }}>
        {#each games as game (game.id)}
          <Save {...game} />
        {/each}
      </div>
    </PixelatedContainer>
  </main>
</div>
