<script>
  export let evolutions, select = _ => _, pokemon, nickname

  import { capitalise } from '$lib/utils/string'
  import { Input, Button, IconButton, PIcon, AutoComplete, Picture } from '$lib/components/core'
  import { Dice } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const { getLeague, getPkmn, getPkmns } = getContext('game')

  import { routedata, readdata, activeGame } from '$lib/store'

  import { format, randomTemplate } from './prose'

  let gyms
  routedata.subscribe(value => (gyms = value.filter(g => g.type === 'gym')))
  const [, key] = readdata()

  const onrandom = () => {
    let temp = base
    base = randomTemplate()
    if (temp === base) onrandom()
  }

  const getleaders = (l) => [...new Set(l || [])]
  const getleader = (league, boss) => league && boss ? league[boss.value] : null
  const getmons = (league, boss) => league && boss ? league[boss.value]?.pokemon : null
  const getatks = (mon) => mon?.moves

  let selected, opponent, attack
  let text, base

  let league, leadermons
  $: getLeague(key).then(l => (league = l))
  $: getPkmns((getmons(league, selected) || []).map(p => p.name)).then(e => leadermons = Object.values(e))

  $: ctx = { pokemon, nickname, opponent, attack, boss: selected, league }
  $: base = randomTemplate()
  $: text = format(base, ctx)

</script>

<section class='flex flex-col w-[45ch] text-center items-center dark:bg-gray-900 bg-gray-50 rounded-lg p-4 md:p-8 pb-12 mx-auto shadow-lg  dark:text-gray-200'>
  <h2 class='text-2xl '>R.I.P. {(nickname ? (nickname + ' the ') : '') + pokemon.name}</h2>

  <div class='h-px w-full my-4 dark:bg-gray-500 bg-gray-500' />

    <form class='w-full gap-2 flex flex-col mb-4'>
      <AutoComplete
        className='flex-1 w-full relative'
        rounded
        placeholder=Opponent
        items={getleaders(gyms)}
        label={i => i.boss. trim()}
        bind:selected
      >
        <span class='w-full inline-flex justify-between items-center text-sm md:text-base h-4 md:h-8 px-4 py-4 md:py-6 '
              slot=item let:item let:label>
          <span class='line-clamp-1 text-left'>{@html label}</span>
          {#if league}
          <Picture
            src='https://img.nuzlocke.app/{league[item.value].img?.src || league[item.value].img}'
            alt={item.name}
            pixelated
            className='w-16 md:w-24 translate-x-1/4 float-right'
            aspect=72x52
            />
          {/if}
        </span>

        <svelte:fragment slot=icon let:iconClass>
          {#if selected}
            <Picture
              src='https://img.nuzlocke.app/{league[selected.value].img?.src || league[selected.value].img}'
              alt={selected.name}
              fade={false}
              pixelated
              className='w-16 md:w-24 absolute right-6 -top-1/2 z-10 pointer-events-none'
              aspect=72x52
              />
            {/if}
        </svelte:fragment>

      </AutoComplete>

      <AutoComplete
        className='flex-1 w-full'
        rounded
        placeholder=Pokemon
        items={leadermons}
        label={i => i.name}
        bind:selected={opponent}
        >
        <span class='w-full inline-flex justify-between items-center h-8 px-4 py-5 md:py-6'
              slot=item let:item let:label>
          <span>{@html label}</span>
          {#if league}
          <img
            src='https://img.nuzlocke.app/sprite/{item.imgId}.png'
            alt={item.name}
            class='w-16 md:w-24 translate-x-1/4 float-right pointer-events-none'
            />
          {/if}
        </span>

        <svelte:fragment slot=icon>
          {#if opponent}
            <img
              src='https://img.nuzlocke.app/sprite/{opponent.imgId}.png'
              alt={opponent.name}
              class='w-16 md:w-24 absolute right-4 z-10 -top-1/2 pointer-events-none'
              />
            {/if}
        </svelte:fragment>

      </AutoComplete>


      <AutoComplete
        className='flex-1 w-full'
        disabled
        rounded
        placeholder=Attack
        items={getatks(opponent)}
        label={i => i.name}
        bind:selected={attack}
        >
        <span class='w-full inline-flex justify-between items-center md:h-4 h-8 px-4 py-5 md:py-6 '
              slot=item let:item let:label>
          <span>{@html label}</span>
        </span>
      </AutoComplete>


    </form>

  <p class='text-base md:text-xl bg-gray-800 px-2 py-3 md:px-4 md:py-6 rounded-lg w-full relative'>
    <PIcon
      className='grayscale transform scale-200 mb-4 -mt-2'
      name={pokemon.alias}
      />

    <br />

    <span
      class='select-text border-transparent px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:underline underline-offset-4 outline-none'
      tabIndex='0'
      contenteditable
      >

      <!-- FIXME: Contenteditable needs to modify base -->
      {text}
    </span>

    <IconButton
      rounded
      borderless
      color=yellow
      src={Dice}
      on:click={onrandom}
      containerClassName='absolute bottom-0 right-0'
      title='Transfer save'
    />
  </p>
  <small class='mb-6 mt-1 italic text-gray-600'>
    Click on the epitaph to write your own.
  </small>

  <div class='w-full text-center inline-flex -mb-4 gap-x-4'>
    <Button className='flex-1 bg-' rounded>
      Skip
    </Button>
    <Button className='flex-1' rounded>
      Leave Epitaph
    </Button>
  </div>
</section>

<style>
  button {
    transform: scale(2);
    transition: transform 0.2s ease;
  }

  button:hover {
    cursor: pointer;
    transform: scale(2.2);
    animation: shake 3.2s cubic-bezier(.36,.07,.19,.97) infinite;
  }
</style>
