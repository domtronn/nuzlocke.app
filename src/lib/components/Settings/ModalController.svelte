<script>
  import { onMount, getContext } from 'svelte'
  import { IconButton } from '$lib/components/core'
  import Settings from 'svelte-icons-pack/vsc/VscSettings'

  let SettingsModal
  onMount(() => {
    import('$lib/components/Settings').then(m => SettingsModal = m.Modal)
  })

  const { open } = getContext('simple-modal')
  const onopen = _ => open(SettingsModal)
</script>

<!-- TODO: Readd -->
<!-- <IconButton -->
<!--   rounded -->
<!--   src={Settings} -->
<!--   title='Open game settings' -->
<!--   containerClassName='absolute top-0 right-2 md:relative' -->
<!--   on:click={onopen} -->
<!-- /> -->
