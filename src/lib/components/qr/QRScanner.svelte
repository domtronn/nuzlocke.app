<script>
  import LibLoader from './LibLoader.svelte'
  import { INSTASCAN } from '$utils/rewrites'

  import { createEventDispatcher, onDestroy } from 'svelte'
  const dispatch = createEventDispatcher()

  let scanner, camera
  const onloaded = _ => {
    scanner = new window.Instascan.Scanner({
      video: document.getElementById('preview')
    })

    scanner.addListener('scan', value => dispatch('scan', { value }))

    window.Instascan.Camera
      .getCameras()
      .catch(e => dispatch('error', { value: e.toString() }))
      .then(cameras => {
        if (!cameras || !cameras.length) dispatch('error', { value: 'No cameras' })

        camera = cameras.find(c => c.name.indexOf('back') > -1) || cameras[0]
        scanner.start(camera)
        dispatch('start')
      })
  }

  onDestroy(() => {
    if (scanner && camera) scanner.stop(camera)
  })

</script>

<LibLoader
  src={INSTASCAN}
  expected=Instascan
  on:loaded={onloaded} />

<video id=preview>
  <track kind="captions" />
</video>
