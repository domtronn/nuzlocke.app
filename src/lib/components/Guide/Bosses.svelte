<script>
  export let gyms, game, path, data
  import { Tabs, PIcon } from '$c/core'
  import GymCard from '$c/gym-card.svelte'

  import { capitalise, toSlug, toId } from '$utils/string'

  import Icon from 'svelte-icons-pack'
  import Link from 'svelte-icons-pack/bi/BiLink'

  const count = Object.values(gyms).flat().length
  const order = ['Gym Leader', 'Elite Four', 'Rival', 'Evil Team', 'Other'].filter(i => gyms[i])
  const identity = i => i

  const rivalVal = gyms['Rival'][0].value
  const champVal = gyms['Elite Four'].slice(-2)[0].value
  const rivalData = data.fire[rivalVal]
  const champData = data.fire[champVal]

  let starter = 'fire'
  const setstarter = type => _ => starter = type
</script>

<h2 id=boss-summary>
  <a title='{game.title} Boss Battles' href='{path}#bosses'>
    <Icon src={Link} size=1.8rem className=fill-current />
  </a>
  {game.title} Boss Battles
</h2>


<section class=copy>
  <div>
    <p>
      In order to complete a <b>{game.title}</b> Nuzlocke and become the
      Champion, you will need to win <span class=figure>{count}</span>
      Boss battles throughout the {capitalise(game.region)} region - ranging from
      bickering Rival & Evil team fights, to Gym Leaders & ultimately the Elite Four.
    </p>
    <p>
      These can be a challenge, especially when your dear nicknamed
      nuzlocke mons are at risk. So below we've listed detailed
      overviews of all these fights! Giving you all the information you'll need to
      face everything from <b>{rivalData.name}'s {capitalise(rivalData.pokemon[0].name)}</b> to
      <b>{champData.name}'s {capitalise(champData.pokemon.slice(-1)[0].name)}</b>.
    </p>
  </div>
  <div>
    {#each order as group}
      <p>
        {gyms[group].length}
        <span>{group} fight{gyms[group].length !== 1 ? 's' : ''}</span>
      </p>
    {/each}
  </div>
</section>

<section class=starter>
  <h3>Select your starter type</h3>
  <ul role=radiogroup class=flex>
    {#each ['grass', 'water', 'fire'] as type}
      <li class={type} on:click={setstarter(type)} title='Select {type}' aria-checked={starter === type} role=radio>
        <PIcon className='starter-icon' type=symbol name='type-{type}' />
      </li>
    {/each}
  </ul>

  <p>
    Like all Pokémon games, you will have to select a starter. The
    type will update some of the boss teams to match. For
    example, if your starter was a grass type <b>{rivalData.name}</b> might have a
    fire type to take advantage!
  </p>
</section>

{#each order as group, i}
  <section>
    <h3 id={toSlug(group)}>
      <a title='{group} fights' href='{path}#{toSlug(group)}'>
        <Icon src={Link} size=1.8rem className=fill-current />
      </a>

      {group} fights
    </h3>

    <ul>
      {#each gyms[group] as { group, value, boss, name, lvlCap }}
        <li id={toId.boss(boss, name)}>
          <GymCard
            reader
            forceLevelCap
            loading={false}
            {game}
            {starter}
            id={value}
            location={name}
            />
        </li>
      {/each}
    </ul>
  </section>
{/each}


<style>
  .lvlcap { @apply absolute top-3 right-0 md:-right-16}

  h2, li, div { @apply relative }

  .copy { @apply flex flex-col md:inline-block md:mt-0}
  .copy div { @apply inline-block w-full md:w-2/3 }
  .copy div + div {
    @apply w-full inline-flex align-top gap-6 flex-wrap justify-center items-center -mt-4 md:-mt-16;
  }

  @media (min-width:theme('screens.sm')) {
    .copy div + div {
      width: calc(32% - 1px);
    }
  }

  .copy div + div p {
    @apply flex flex-col items-center justify-center text-4xl font-bold w-28 h-24 text-center bg-gray-100 shadow-lg rounded-lg mb-0
  }
  :global(.dark) .copy div + div p {
    @apply bg-gray-900
  }

  .copy div + div span {
    @apply text-sm tracking-widest
  }

  p { @apply transition }

  section { @apply my-6 }

  h2, h3 { @apply tracking-widest }
  h2 { @apply text-2xl md:text-3xl font-bold mb-6 mt-12 }

  h3 { @apply tracking-widest flex justify-between w-full items-center text-xl font-medium mb-6 mt-12 }

  ul { @apply flex flex-col gap-y-4 }
  .starter ul { @apply justify-center flex-row gap-x-4 my-6 }

  p { @apply max-w-2xl mb-10 tracking-widest }

  a {@apply absolute -left-1 -translate-x-full opacity-0 transition}

  a:hover {
    color: #4434ff;
    @apply opacity-100
  }

  .starter {
     @apply flex flex-col items-center mx-auto
  }
  .starter h3 { @apply justify-center my-2 }
  .starter li {
    transition: all 0.2s ease;
    @apply flex items-center justify-center rounded-full w-24 h-24;
  }

  .starter p {
    @apply md:text-center
  }

  .starter li { @apply transform scale-50 -my-8 md:scale-100 md:my-0 cursor-pointer; }
  .starter li.fire[aria-checked=true] { background-color: #ff9d53; }
  .starter li.water[aria-checked=true] { background-color: #4c91d7; }
  .starter li.grass[aria-checked=true] { background-color: #62bc5b; }

  .starter li[aria-checked=true] :global(.starter-icon) {
    filter: brightness(10);
    opacity: 1;
  }

  :global(.starter-icon) {
    @apply cursor-pointer;
    filter: brightness(0);
    opacity: 0.5;
    transition: all 0.2s ease;
  }

  :global(.dark .starter-icon) {
    @apply cursor-pointer;
    filter: brightness(10);
    opacity: 0.5;
    transition: all 0.2s ease;
  }

  .starter li[aria-checked=false]:hover :global(.starter-icon) {
    filter: brightness(1);
    opacity: 1;
  }

  p { @apply leading-loose }
  .figure { @apply inline text-xl md:text-2xl font-bold }

</style>
