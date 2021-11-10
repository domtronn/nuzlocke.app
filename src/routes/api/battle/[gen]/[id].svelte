<script context="module">
  export async function load({ page, fetch }) {
    return { props: page.params }
  }
</script>

<script>
  export let gen, id
  import GymCard from '$lib/components/gym-card.svelte'
</script>

<GymCard game={gen} id={id} />
