<script>
  export let className = ''

  import { Button } from '$lib/components/core'
  import { getContext, onMount } from 'svelte'

  const { open } = getContext('simple-modal')
  const handleimport = _ => open(ImportModal)

  let ImportModal
  onMount(_ => import('$lib/components/qr/ImportModal.svelte').then(mod => ImportModal = mod.default))
</script>

<Button rounded {className} on:click={handleimport}>
  <slot />
</Button>
