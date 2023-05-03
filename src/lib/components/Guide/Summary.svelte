<script>
  export let game, encounters, encounterMap, count, routes, path

  import { toId, toList, capitalise } from '$utils/string'
  import { PIcon, Tooltip } from '$c/core'
  import TypeBadge from '$c/type-badge.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Link } from '$icons'
</script>

<h2 id="encounters">
  <a title="{game.title} Encounters" href="{path}#encounters">
    <Icon inline={true} icon={Link} height="1.8rem" class="fill-current" />
  </a>
  {game.title} Encounters
</h2>

<p>
  A fun aspect of Nuzlocke runs is the variety of encounters forcing you to try
  out new Pokémon you've never used before. That is why it's important to know
  which Pokémon will be available during a run. We've compiled a list of every
  encounter for <b>Pokémon {game.title}</b> so you can quickly see who you might
  want on your team!
</p>
<p>
  <b>Pokémon {game.title}</b> has <span class="figure">{routes.length}</span>
  different encounter locations with
  <span class="figure">{count}</span> different Pokémon available as wild
  encounters.
  <span aria-hidden>Hover over a Pokémon to see where to encounter it!</span>
</p>

<p>
  {#each Object.entries(encounters).sort(([, a], [, b]) => a.length - b.length) as [type, encounters]}
    <h3 class="sr-only">
      {encounters.length}
      {capitalise(type)} Pokémon encounters
    </h3>
    <ul class="sr-only">
      {#each encounters as { name, sprite }}
        <li class="sr-only">
          {capitalise(name)} - {toList(
            encounterMap[sprite] || [],
            (i) => i,
            'and'
          )}
        </li>
      {/each}
    </ul>
  {/each}
</p>

<div>
  {#each Object.entries(encounters).sort(([, a], [, b]) => a.length - b.length) as [type, encounters]}
    <section id={toId.encounter(type)}>
      <h3>
        <span>
          <a
            title="{capitalise(type)} Pokémon"
            href="{path}#{toId.encounter(type)}"
          >
            <Icon
              inline={true}
              icon={Link}
              height="1.8rem"
              class="fill-current"
            />
          </a>
          <span class="figure">{encounters.length}</span>{capitalise(type)} Pokémon
        </span>
        <TypeBadge type={type.toLowerCase()} />
      </h3>

      <ul>
        {#each encounters as { name, sprite, original }}
          <li class="text-xs" title={name}>
            <PIcon lazy name={sprite} />
            <Tooltip>
              Find {name} at {toList(
                encounterMap[sprite] || [],
                (i) => i,
                'and'
              )}
            </Tooltip>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style lang="postcss">
  section {
    @apply my-6;
  }

  h2,
  h3 {
    @apply tracking-wide;
  }
  h2 {
    @apply mb-6 mt-12 text-2xl font-bold;
  }
  h3 {
    @apply mb-2 flex w-full items-center justify-between text-base;
  }
  h3 span {
    @apply inline-flex items-center gap-x-2;
  }
  div {
    @apply grid gap-x-12 md:grid-cols-2;
  }

  p {
    @apply mb-10 max-w-2xl leading-6 tracking-wide;
  }
  .figure {
    @apply inline text-xl font-bold md:text-2xl;
  }

  ul {
    @apply grid grid-cols-10 md:grid-cols-12;
  }

  li {
    @apply flex scale-125 items-center justify-center;
    max-height: 40px;
    overflow: hidden;
  }

  h2,
  span {
    @apply relative;
  }
  a {
    @apply absolute -left-1 -translate-x-full opacity-0 transition;
  }

  a:hover {
    color: #4434ff;
    @apply opacity-100;
  }
</style>
