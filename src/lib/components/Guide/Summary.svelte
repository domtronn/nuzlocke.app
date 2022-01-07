<script>
  export let game, encounters, count, routes, path

  import { toId } from '$utils/string'
  import { PIcon } from '$c/core'
  import TypeBadge from '$c/type-badge.svelte'

  import Icon from 'svelte-icons-pack'
  import Link from 'svelte-icons-pack/bi/BiLink'

</script>

<h2 id=encounters>
  <a href='{path}#encounters'>
    <Icon src={Link} size=1.8rem className=fill-current />
  </a>
  {game.title} Encounters
</h2>

<p>
  <b>{game.title}</b> has <span class=figure>{routes.length}</span> different
  encounter locations with
  <span class=figure>{count}</span> different Pokémon available as wild
  encounters. You can see a lists of all available Pokémon by type
  below.
</p>

<div>
  {#each Object.entries(encounters).sort(([, a], [, b])=> a.length - b.length) as [type, encounters]}
    <section id={toId.encounter(type)}>
      <h3>
        <span>
          <a href='{path}#{toId.encounter(type)}'>
            <Icon src={Link} size=1.8rem className=fill-current />
          </a>
          <span class=figure>{encounters.length}</span> {type} Pokémon encounters
        </span>
        <TypeBadge type={type.toLowerCase()} />
      </h3>


      <ul>
        {#each encounters as name}
          <li title={name}>
            <PIcon {name} />
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  section { @apply my-6 }

  h2, h3 { @apply tracking-widest }
  h2 { @apply text-2xl font-bold mb-6 mt-12 }
  h3 { @apply flex justify-between w-full items-center mb-2 text-base }
  h3 span { @apply inline-flex items-center gap-x-2  }
  div { @apply grid md:grid-cols-2 gap-x-12 }

  p { @apply max-w-2xl mb-10 tracking-widest leading-loose }
  .figure { @apply inline text-xl md:text-2xl font-bold }

  ul {
    @apply grid grid-cols-10 md:grid-cols-12;
  }

  li {
    @apply flex items-center justify-center -my-3 scale-125;
  }

  h2, span { @apply relative }
  a {
    @apply absolute -left-1 -translate-x-full opacity-0 transition
  }

  a:hover {
    color: #4434ff;
    @apply opacity-100
  }

</style>
