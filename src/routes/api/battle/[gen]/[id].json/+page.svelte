<script context="module">
  export async function load({ page }) {
    return { props: page.params }
  }
</script>

<script>
  export let gen, id
  import GymCard from '$lib/components/gym-card.svelte'
</script>

<GymCard starter=fire game={gen} id={id} />
