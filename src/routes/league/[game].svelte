<script context="module">
  import leaders from '$lib/data/leaders.json'
  import games from '$lib/data/games.json'

  export async function load({ page, fetch }) {
    const { pid } = games[page.params.game]
    const path = Object.keys(leaders[pid])

    console.log({ game: page.params.game, path })

    return { props: { game: pid, path } }
  }
</script>

<script>
  export let game, path
  import GymCard from '$lib/components/gym-card.svelte'
</script>

{#each path as gym}
  <GymCard game={game} id={gym} />
{/each}
