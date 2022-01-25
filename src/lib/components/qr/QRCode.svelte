<script>
  import LibLoader from './LibLoader.svelte'
  import { QRCODE } from '$utils/rewrites'

  export let value, size = 192

  let qrCode, qrCodeId = 'qrcode'
  const onloaded = _ => {
    qrCode = new window.QRCode(document.getElementById(qrCodeId), {
      text: value, width: size, height: size, colorDark: '#000',
      colorLight: '#fff', correctLevel: window.QRCode.CorrectLevel.H,
    })
  }
</script>

<LibLoader
  src={QRCODE}
  expected=QRCode
  on:loaded={onloaded} />

<div id={qrCodeId} />
