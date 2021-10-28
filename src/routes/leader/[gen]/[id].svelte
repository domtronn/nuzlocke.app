<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/leader/${page.params.gen}/${page.params.id}.json`)

    if (res.ok) {
      const data = await res.json()
      return { props: { data } }
    }

    return {
      status: res.status,
      error: new Error(`Error fetching data`)
    };
  }
</script>

<script>
  export let data
  import GymCard from '$lib/components/gym-card.svelte'
</script>

<GymCard {...data} />
