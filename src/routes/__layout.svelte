<script>
  import '../app.css'
  import 'pokemon-assets/assets/css/items.css'
</script>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>

<svelte:head>
  <link rel="preload" href="/data/critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</svelte:head>

<slot />
