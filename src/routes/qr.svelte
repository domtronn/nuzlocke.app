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

  $: encoded = encodeURIComponent(JSON.stringify({ save, data }))

  console.log(data)

</script>

<span>
  {('https://nuzlocke.vercel.app/drop?' + encoded).length}
</span>
<span>
  https://nuzlocke.vercel.app/drop?{encoded}
</span>
<QR
  size=480
  value='https://nulzocke.vercel.app/drop?kajshdaksjdhaksjdhaksjdhaksjdhaksdjhaksjdhaksjdhaksjdhaksdjhakjhdkajhsdkasjhdakjshdaksjdhaksjdhaksjdhaksjdhaksjdhaksjdhakjshdakjshdaksjdhaksjdhaksjdhakjsdhaksjdhaksjdhaksjdhaksjdh' />

<QRScanner on:scan={e => alert(e.detail.value)} />
