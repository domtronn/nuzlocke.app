<script>
  import { onMount, getContext } from 'svelte'
  import { IconButton } from '$lib/components/core'
  import { Settings } from '$icons'

  let SettingsModal
  onMount(() => {
    import('$lib/components/Settings').then(m => SettingsModal = m.Modal)
  })

  const { open } = getContext('simple-modal')
  const onopen = _ => open(SettingsModal)
</script>

<IconButton
  rounded
  borderless=sm
  src={Settings}
  title='Open game settings'
  className='m-1 md:m-2'
  containerClassName={$$restProps.class || 'absolute top-14 md:top-0 right-4 md:relative'}
  on:click={onopen}
/>
