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
  export let data;

  import Pokemon from '$lib/components/pokemon.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
</script>

<div class='m-6'>
  <span class='inline-flex gap-x-2'>
    <h1 class='text-xl font-medium'>{data.name}</h1>
    <div><TypeBadge type={data.speciality} /></div>
  </span>
  <h2 class='text-md font-medium'>The {data.speciality} gym</h2>

  <div class='grid lg:grid-cols-3 md:grid-cols-2 mt-8 gap-x-6 gap-y-10'>
    {#each data.pokemon as p}
      <Pokemon {...p} />
    {/each}
  </div>
</div>
