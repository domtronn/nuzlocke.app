<script>
  import { savedGames } from '$lib/store'
  import { slide } from 'svelte/transition'

  // TODO: No saves and back button

  import Save from '$lib/components/save.svelte'
  import ScreenContainer from '$lib/components/screen-container.svelte'
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import Icon from 'svelte-icons-pack'
  import Floppy from 'svelte-icons-pack/im/ImFloppyDisk'

  let gameData = ''
  savedGames.subscribe(val => gameData = val)

  $: games = (gameData || '')
    .split(',')
    .filter(i => i)
    .map(s => s.split('|'))
    .map(([id, created, name, game]) => ({ id, created, name, game}))
</script>

<ScreenContainer>
  <span class='flex justify-between items-center px-2 gap-x-24'>
    <h1 class='text-2xl'>Load game</h1>
    <Icon src={Floppy} size='1.4em' />
  </span>

  <hr />


  <div transition:slide={{ duration: 300 }}>
    {#if games.length}
      {#each games as game (game.id)}
        <Save {...game} />
      {/each}
    {:else}
      You have no games
        <a sveltekit:prefetch href="/new">
          <button>New game</button>
        </a>
      {/if}
  </div>
</ScreenContainer>
