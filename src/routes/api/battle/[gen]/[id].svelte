<script context="module">
  export async function load({ page }) {
    return { props: { ...page.params, starter: page.query.get('starter')} }
  }
</script>

<script>
  export let gen, id, starter
  import Modal from 'svelte-simple-modal'
  import GymCard from '$lib/components/gym-card.svelte'
</script>

<Modal>
  {starter}
<GymCard game={gen} {id} {starter} />
</Modal>
