<script context=module>
  export const ssr = false
</script>

<script>
  import { onMount } from 'svelte'

  import QR from '$lib/components/qr/QRCode.svelte'
  import QRScanner from '$lib/components/qr/QRScanner.svelte'

  import { getGame, savedGames, activeGame, read, parse } from '$lib/store'

  let data, save

  activeGame.subscribe(id => {
    savedGames.subscribe(parse(g => {
      save = g[id]
    }))

    getGame(id).subscribe(read(game => {
      data = game
    }))
  })

  const fetchurl = (data) =>
    fetch('/api/tiny.json', {
      method: 'POST',
      body: JSON.stringify({
        url: `http://localhost:3000/drop?payload=${encodeURIComponent(JSON.stringify(data))}`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
</script>

{#await fetchurl({ data, save }) then tiny}
  <a href={tiny.url}>
    {tiny.url}
  </a>
  <QR size=480 value={tiny.url} />
{/await}

<!-- <QRScanner on:scan={e => alert(e.detail.value)} /> -->
