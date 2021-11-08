<script context="module">
  import league from '$lib/data/league.json'
  import games from '$lib/data/games.json'

  export async function load({ page }) {
    if (!games[page.params.game])
      return { props: {} }

    const { pid, lid } = games[page.params.game]
    const path = Object.keys(league[lid || pid])

    return { props: { game: page.params.game, path } }
  }
</script>

<script>
  export let game, path
  import GymCard from '$lib/components/gym-card.svelte'
</script>

{#each path as gym}
  <GymCard starter='fire' game={game} id={gym} />
{/each}
