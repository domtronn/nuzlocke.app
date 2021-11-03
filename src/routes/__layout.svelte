<script>
  import '../app.css'
</script>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .pkm-wrapper {
      width: 67px;
      height: 56px;
      line-height: 54px;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      padding: 1px;
    }

    .pkm {
      display: inline-block;
      vertical-align: middle;
      image-rendering: crisp-edges;
      image-rendering: pixelated;
    }
</style>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</svelte:head>

<slot />
