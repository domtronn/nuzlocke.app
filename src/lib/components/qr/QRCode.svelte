<script>
  const src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'
  
  import LibLoader from './LibLoader.svelte'

  export let value, size = 192

  let qrCode, qrCodeId = 'qrcode'
  const onloaded = _ => {
    qrCode = new window.QRCode(document.getElementById(qrCodeId), {
      text: value, width: size, height: size, colorDark: '#000',
      colorLight: '#fff', correctLevel: window.QRCode.CorrectLevel.H,
    })
  }

  const gen = _ => qrCode.makeCode(value)
</script>

<LibLoader
  {src}
  expected=QRCode
  on:loaded={onloaded} />

<div id={qrCodeId} />
