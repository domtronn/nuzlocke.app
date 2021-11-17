<script context="module">
  export const prerender = true
</script>

<script>
  import { savedGames, activeGame, createGame } from '$lib/store'
  import { PixelatedContainer, ScreenContainer } from '$lib/components/containers'

  import { AutoComplete, Input, Picture } from '$lib/components/core'

  import File from 'svelte-icons-pack/cg/CgFileAdd'
  import Games from '$lib/data/games.json'
  import Button from '$lib/components/core/Button.svelte'
  import Tabs from '$lib/components/core/Tabs.svelte'
  import PIcon from '$lib/components/core/PokemonIcon.svelte'

  import { filterObj } from '$lib/utils/arr'

  let validGames = filterObj(Games, g => g.supported)

  let gameName = ''
  const handleNewGame = () => {
    if (!selectedGame.supported)
      return alert(`Sorry, ${selectedGame.title} is currently not supported`)

    savedGames.update(createGame(gameName, selected))
    window.location = '/game'
  }

  let hoverActive = false
  const togglehover = _ => hoverActive = !hoverActive

  let selected
  const handleSelect = id => _ => selected === id ? selected = null : selected = id

  let gen = 'All'
  const gens = ['All']
    .concat(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'])
    .map((l, i) => ({ label: i === 0 ? l : `Gen ${l}`, val: l }))

  $: selectedGame = validGames[selected]
  $: disabled = !gameName.length || !selected
</script>

<svelte:head>
  <title> Nuzlocke Tracker | New game </title>
</svelte:head>

<ScreenContainer title='New Nuzlocke' className='-mt-16' icon={File}>
  <div class='flex flex-col sm:flex-row sm:flex-wrap sm:gap-y-4 gap-2'>
    <Input
      rounded
      name=Name
      placeholder=Name
      className=sm:flex-1
      bind:value={gameName}
    />

    <AutoComplete
      rounded
      name=Game
      placeholder=Game
      className='block sm:hidden'
      items={Object.keys(validGames)}
      label={i => i && Games[i].title}
      bind:selected={selected}
    >

      <div class='flex inline-flex gap-x-2 py-2 items-center h-8' slot='item' let:item={i} let:label={label}>
        {#if Games[i].logo}
          <Picture
            src={Games[i].logo}
            alt={Games[i].title + ' logo'}
            aspect=32xauto
          />
        {/if}
        {@html label}
      </div>
    </AutoComplete>

    <Button rounded disabled={disabled} on:click={handleNewGame}>
      Create game
    </Button>
  </div>

  <Tabs name='gens' className='hidden sm:flex' tabs={gens} bind:selected={gen} />

  <div class='grid items-center justify-center gap-x-4 gap-y-6 grid-cols-3 sm:grid-cols-4 hidden sm:grid'>
    {#each Object.entries(validGames) as [id, game]}
      {#if game.logo && (gen === 'All' || game.gen === gen) }
        <span
          on:click={handleSelect(id)}
          on:mouseenter={togglehover}
          on:mouseleave={togglehover}
          class='w-full text-center'
        >
          <Picture
            src={game.logo}
            aspect={game.aspect}
            alt={'Pokémon ' + game.title + ' logo'}
            className='w-24 mx-auto transition hover:grayscale-0 {(selected && selected !== id) || hoverActive ? 'grayscale' : ''} {selected === id ? 'grayscale-0' : ''} cursor-pointer'
          />
        </span>
      {/if}
    {/each}
  </div>

  <i class='p-2 text-sm text-center text-gray-400'>
    <b>N.B.</b> Missing games just haven't had the data created for them yet,
    <br />they will be updated regularly so check back soon for your favourite!
  </i>

</ScreenContainer>

<style>
  img { transition-duration: 250ms !important; }
</style>
