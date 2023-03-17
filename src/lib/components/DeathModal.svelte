<script>
  export let evolutions, select = _ => _, pokemon, nickname

  import { capitalise } from '$lib/utils/string'
  import { Input, Button, IconButton, PIcon, AutoComplete, Picture } from '$lib/components/core'
  import { Dice } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const { getLeague, getPkmn } = getContext('game')

  import { routedata, readdata, activeGame } from '$lib/store'

  let gyms, league
  routedata.subscribe(value => (gyms = value.filter(g => g.type === 'gym')))
  const [, key] = readdata()

  const TokenisedLossSentiments = [
    `After sending in <POKEMON NAME> to battle, <POKEMON NAME> was shocked when <OPPONENT NAME>'s <OPPONENT POKEMON> easily defeated them.`,
    `Despite their best efforts, <POKEMON NAME> was no match for <OPPONENT NAME>'s <OPPONENT POKEMON>, who easily took down the <POKEMON NAME> with a powerful <OPPONENT ATTACK> attack.`,
    `<POKEMON NAME>'s overconfidence led them to underestimate a <OPPONENT POKEMON>, resulting in their humiliating death.`,

    `In their battle against <OPPONENT NAME>, <POKEMON NAME> was quickly defeated by a well-placed attack from <OPPONENT POKEMON>.`,
    `Despite their confidence, <POKEMON NAME> was no match for <OPPONENT NAME>'s <OPPONENT POKEMON>, who had superior speed and strength.`,
    `<POKEMON NAME> was easily taken out by <OPPONENT NAME>'s <OPPONENT POKEMON>, whose preparation and skill proved to be too much to handle.`,
    `In a moment of desperation, <POKEMON NAME> used the wrong move against <OPPONENT NAME>'s <OPPONENT TYPE> Pokemon, resulting in a devastating kill.`,

    `Despite their careful preparations, <POKEMON NAME> was no match for the devious <OPPONENT NAME> and their powerful <OPPONENT TYPE> Pokemon.`,
    `Relying on <POKEMON NAME> proved to be a mistake, as they were unable to best the diverse team of <OPPONENT NAME>.`,
    `The trainer's underestimation of <OPPONENT NAME>'s unconventional team ended up costing the life of <POKEMON NAME> in their battle against <OPPONENT NAME>.`,
    `Despite their best efforts, <POKEMON NAME> was unable to overcome the tricky strategies of the sly <OPPONENT POKEMON>.`,

    `<POKEMON NAME> got unlucky with their moves repeatedly missing leading to their death.`,
    `Despite having a type advantage, <POKEMON NAME> missed their attack, allowing <OPPONENT NAME>'s <OPPONENT POKEMON> to land a critical hit.`,
    `In a tense battle, <POKEMON NAME> died to <OPPONENT NAME>'s <OPPONENT POKEMON> who landed critical hit after critcal hit.`,
    `<POKEMON NAME> was doing well in the battle uutontil <OPPONENT NAME>'s <OPPONENT POKEMON> landed a critical hit, which knocked them out in one blow.`,

    `In a heroic display, <POKEMON NAME> sacrificed themselves to allow the rest of their team to set up and sweep <OPPONENT NAME>'s team.`,
    `<POKEMON NAME> knew that sacrificing themselves was necessary to give the team a better chance in future battles.`,
    `Sacrificing <POKEMON NAME> was a calculated decision to take out <OPPONENT NAME>'s <OPPONENT POKEMON> and secure the win.`,
    `<POKEMON NAME> sacrificed themselves so that they could switch in a teammate with a type advantage and gain the upper hand.`,
    `Despite losing <POKEMON NAME>, they knew their sacrifice was the best move to make in the long run.`
  ]

  let random = l => l[Math.floor(Math.random() * l.length)]
  const format = (text) => {
    return text
      .replace('<POKEMON NAME>', (nickname ? `${nickname} the ` : '') + pokemon.name )
      .replaceAll('<POKEMON NAME>', nickname || pokemon. name)
      .replaceAll('<POKEMON TYPE>', pokemon.types.join(' & '))
      .replaceAll('<OPPONENT NAME>', selected?.boss || 'their opponent')
      .replaceAll('<OPPONENT POKEMON>', opponent?.name || 'pokemon')
      .replaceAll('<OPPONENT ATTACK>', attack?.name || 'attack')
      .replaceAll('<OPPONENT TYPE>',
                  getleader(league, selected)?.speciality + ' type'
                  || opponent?.types[0] + ' type'
                  || '')
      .replace(/ +/g, ' ')
  }

  const onrandom = () => {
    let temp = base
    base = random(TokenisedLossSentiments)
    if (temp === base) onrandom()
  }

  const getleaders = (l) => [...new Set(l || [])]
  const getleader = (league, boss) => league && boss ? league[boss.value] : null
  const getmons = (league, boss) => league && boss ? league[boss.value]?.pokemon : null
  const getatks = (mon) => mon?.moves

  let selected, opponent, attack
  let text, base
  $: getLeague(key).then(l => (league = l))

  $: opponent && getPkmn(opponent).then(console.log)

  $: attack && (text = format(base))
  $: opponent && (text = format(base))
  $: selected && (text = format(base))
  $: base = random(TokenisedLossSentiments)
  $: text = format(base)

  $: opponent && console.log(opponent)

</script>

<section class='flex flex-col max-w-[45ch] text-center items-center dark:bg-gray-900 bg-gray-50 rounded-lg p-4 md:p-8 pb-12 mx-auto shadow-lg  dark:text-gray-200'>
  <h2 class='text-2xl '>R.I.P. {(nickname ? (nickname + ' the ') : '') + pokemon.name}</h2>

  <div class='h-px w-full my-4 dark:bg-gray-500 bg-gray-500' />

    <form class='w-full gap-2 flex flex-col mb-4'>
      <AutoComplete
        className='flex-1 w-full'
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
            className='w-16 md:w-18 translate-x-1/4 float-right'
            aspect=72x52
            />
          {/if}
        </span>
      </AutoComplete>

      <AutoComplete
        className='flex-1 w-full'
        rounded
        placeholder=Pokemon
        items={getmons(league, selected)}
        label={i => i.name}
        bind:selected={opponent}
        >
        <span class='w-full inline-flex justify-between items-center h-8 px-4 py-5 md:py-6 '
              slot=item let:item let:label>
          <span>{@html label}</span>
        </span>
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
      bind:textContent={text}
      contenteditable
    >
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
