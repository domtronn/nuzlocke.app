<script>
  const src = 'https://cdn.rawgit.com/schmich/instascan-builds/master/instascan.min.js'

  import LibLoader from './LibLoader.svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  let scanner
  const onloaded = _ => {
    scanner = new window.Instascan.Scanner({
      video: document.getElementById('preview')
    })

    scanner.addListener('scan', value => dispatch('scan', { value }))

    window.Instascan.Camera
      .getCameras()
      .catch(e => dispatch('error', { value: e.toString() }))
      .then(cameras => {
        if (!cameras.length) dispatch('error', { value: 'No cameras' })

        scanner.start(cameras[0])
        dispatch('start')
      })
  }
</script>

<LibLoader
  {src}
  expected=Instascan
  on:loaded={onloaded} />

<video id=preview>
  <track kind="captions" />
</video>
