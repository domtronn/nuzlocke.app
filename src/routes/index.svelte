<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('/leader/3.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json();
      console.log('data', data)
      return {
        props: { data }
      };
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
</script>

<h1>Pokemon</h1>

<pre>
  {JSON.stringify(data, null, 0)}
</pre>

{#each data as p}

  <Pokemon {...p} />

{/each}
