<script>
  export let gyms, game, path
  import { Tabs, PIcon } from '$c/core'
  import GymCard from '$c/gym-card.svelte'

  import { toSlug, toId } from '$utils/string'

  import Icon from 'svelte-icons-pack'
  import Link from 'svelte-icons-pack/bi/BiLink'

  const order = ['Gym Leader', 'Elite Four', 'Rival', 'Evil Team', 'Other'].filter(i => gyms[i])
  const identity = i => i

  let starter = 'fire'
  const setstarter = type => _ => starter = type
</script>

<h2 id=bosses>
  <a title='{game.title} Boss Battles' href='{path}#bosses'>
    <Icon src={Link} size=1.8rem className=fill-current />
  </a>
  {game.title} Boss Battles
</h2>


<p>

</p>

<div>

  <section class=summary id=boss-summary>
    {#each order as group}
      <p>
        {gyms[group].length}
        <span>{group} fight{gyms[group].length !== 1 ? 's' : ''}</span>
      </p>
    {/each}
  </section>

  <section class=starter>
    <h3>Select your starter type</h3>
    <ul role=radiogroup class=flex>
      {#each ['grass', 'water', 'fire'] as type}
        <li class={type} on:click={setstarter(type)} title='Select {type}' aria-checked={starter === type} role=radio>
          <PIcon className='starter-icon' type=symbol name='type-{type}' /></li>
      {/each}
    </ul>
    <p>
      Changing the starter type will update some of the gym or rival
      teams to match. For example, if your starter was a grass type
      your rival will have a fire type to match!
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
</div>

<style>
  .lvlcap { @apply absolute top-3 right-0 md:-right-16}

  h2, li, div { @apply relative }

  div section:first-child { @apply flex flex-wrap gap-y-4 justify-evenly }
  div section:first-child > p { @apply flex flex-col w-40 h-32 justify-center items-center text-4xl md:text-6xl font-bold text-gray-800 bg-gray-50 rounded-xl mb-0 }
  :global(.dark) div section:first-child > p { @apply bg-gray-900 text-gray-50 }

  div section:first-child > p span { @apply text-sm tracking-normal font-normal mt-2 }

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
    @apply text-center
  }

  .starter li { @apply cursor-pointer; }
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

</style>
