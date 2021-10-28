<script context="module">
  import games from '$lib/data/leaders.json'

  export async function load({ page, fetch }) {
    const { leaders, path } = games.progressions[page.params.game]
    const data = await Promise.all(
      path.map(id => fetch(`/leader/${leaders}/${id}.json`).then(res => res.json()))
    )

    return { props: { data } }
  }
</script>

<script>
  export let data
  import GymCard from '$lib/components/gym-card.svelte'
</script>

{#each data as gym}
  <GymCard {...gym} />
{/each}
