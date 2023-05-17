<script>
  import { savedGames, createGame } from '$lib/store'
  import { ScreenContainer } from '$lib/components/containers'

  import {
    Radio,
    Button,
    Tabs,
    Input,
    Logo,
    Tooltip
  } from '$lib/components/core'
  import AutoComplete from '$c/core/AutoCompleteV2.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { File, Dice } from '$icons'

  import Games from '$lib/data/games.json'
  import { IMG } from '$lib/utils/rewrites'

  import { filterObj } from '$lib/utils/arr'

  let validGames = filterObj(Games, (g) => g.supported)

  let gameName = ''
  const handleNewGame = () => {
    if (!selectedGame?.supported)
      return alert(`Sorry, ${selectedGame?.title} is currently not supported`)

    let createid = selected
    if (selectedGame?.difficulty)
      createid += difficultyOptions?.[difficulty]?.id || ''

    savedGames.update(createGame(gameName, createid))
    window.location = '/game'
  }

  const handleGenGame = () => {
    if (!selectedGame?.supported)
      return alert(`Sorry, ${selectedGame?.title} is currently not supported`)

    fetch(`/api/route/generate/${selectedGame?.pid}.json`)
      .then((res) => res.text())
      .then((res) => {
        let createid = selected
        if (selectedGame?.difficulty)
          createid += difficultyOptions?.[difficulty]?.id || ''

        savedGames.update(createGame(gameName, createid, res))
        window.location = '/game'
      })
  }

  let hoverActive = false
  const togglehover = () => (hoverActive = !hoverActive)

  let selected
  const handleSelect = (id) => () =>
    selected === id ? (selected = null) : (selected = id)

  let difficulty = 0,
    difficultyOptions = []

  let gen = 'All'
  const gens = [
    { label: 'All', val: 'All' },
    { label: 'Rom Hacks', val: 'romhack' }
  ].concat(
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'].map((l) => ({
      label: `Gen ${l}`,
      val: l
    }))
  )

  let customName
  $: {
    if ((selectedGame && !gameName) || customName === gameName) {
      customName = gameName = selectedGame
        ? `${selectedGame?.title} Nuzlocke`
        : ''
    }
  }

  $: difficultyOptions = selectedGame?.difficulty?.map((d) => ({
    id: d.split(':')[1],
    name: d.split(':')[0] || 'Normal'
  }))
  $: selectedGame = validGames[selected]
  $: disabled = !gameName.length || !selected
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Create new game</title>
</svelte:head>

<ScreenContainer
  title="Select a New Nuzlocke"
  icon={File}
  className="mb-20 relative"
>
  <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-y-4">
    <Input
      rounded
      placeholder="Name"
      className="sm:flex-1"
      maxlength={26}
      bind:value={gameName}
    />

    <AutoComplete
      max={Object.keys(validGames).length}
      itemF={(_) => Object.keys(validGames)}
      labelF={(i) => i && Games[i].title}
      placeholder="Game"
      class="block sm:hidden"
      bind:selected
    >
      <div
        class="flex inline-flex h-auto max-h-8 w-full items-center px-2 py-6"
        slot="option"
        let:option={i}
        let:label
      >
        {#if Games[i].logo}
          <Logo
            src="{IMG}{Games[i].logo}"
            alt={Games[i].title + ' logo'}
            class="mr-2 w-12"
            role="presentation"
            aspect="192x96"
          />
        {/if}
        {@html label}
      </div>
    </AutoComplete>

    {#if selectedGame?.difficulty}
      <div
        class="my-3 -mr-32 flex flex-auto basis-full flex-col gap-2 md:order-2 md:my-2 md:inline-flex md:flex-row"
      >
        <label
          ><b>Difficulty</b><br /><small class="sm:hidden"
            >This game offers multiple difficulty choices</small
          ></label
        >
        <Radio
          name="difficulty"
          options={difficultyOptions.map((d) => d.name)}
          className="!flex-row gap-x-1"
          bind:selected={difficulty}
        />
      </div>
    {/if}

    <Button rounded {disabled} on:click={handleNewGame}>Create game</Button>
    <div>
      <Tooltip
        >Generate a game with pre-randomized encounters, designed for games like
        Scarlet & Violet with overworld only encounters</Tooltip
      >
      <Button
        className="w-full md:w-auto"
        rounded
        {disabled}
        on:click={handleGenGame}
      >
        Randomize
        <Icon inline="true" icon={Dice} class="inline" />
      </Button>
    </div>
  </div>

  <Tabs
    name="gens"
    className="hidden sm:flex"
    tabs={gens}
    bind:selected={gen}
  />

  <ul
    role="radiogroup"
    aria-labelledby="sc_title"
    class="grid hidden grid-cols-3 items-center justify-center gap-x-4 gap-y-6 sm:grid sm:grid-cols-4"
  >
    {#each Object.entries(validGames) as [id, game]}
      {#if game.logo && (gen === 'All' || game.gen === gen)}
        <button
          role="radio"
          aria-checked={selected === id}
          title="Pokemon {game.title}"
          on:click={handleSelect(id)}
          on:mouseenter={togglehover}
          on:mouseleave={togglehover}
          class="text-wrap group w-full cursor-pointer text-center text-xs font-medium transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
          class:dark:text-yellow-300={selected === id}
          class:text-yellow-500={selected === id}
        >
          <Logo
            src="{IMG}{game.logo}"
            aspect="192x96"
            role="presentation"
            alt={'Pokémon ' + game.title + ' logo'}
            class="mx-auto mb-2 w-24 transition group-hover:grayscale-0 {(selected &&
              selected !== id) ||
            hoverActive
              ? 'grayscale'
              : ''} {selected === id
              ? 'drop-shadow-highlight grayscale-0'
              : ''} cursor-pointer"
          />
          <strong class="mx-auto max-w-[16ch] line-clamp-2">{game.title}</strong
          >
        </button>
      {/if}
    {/each}
  </ul>
</ScreenContainer>

<div class="h-28 w-8" />
