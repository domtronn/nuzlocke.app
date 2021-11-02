<script context="module">
  import games from '$lib/data/leaders.json'
  import Games from '$lib/data/games.json'

  export async function load({ page, fetch }) {
    const { pid } = Games[page.params.game]
    const { leaders, path } = games.progressions[pid]
    return { props: { game: leaders, path } }
  }
</script>

<script>
  export let game, path
  import GymCard from '$lib/components/gym-card.svelte'
</script>

{#each path as gym}
  <GymCard game={game} id={gym} />
{/each}
