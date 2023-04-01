<script>
  import { onMount, getContext, createEventDispatcher } from 'svelte'
  const { open } = getContext('simple-modal')
  const dispatch = createEventDispatcher()

  export let mons = []
  
  let Modal
  onMount(() => {
    import('$lib/components/TeamBuilder/modal.svelte').then(m => Modal = m.default)
  })

  const onopen = (e) => open(Modal, {
    mons,
    max: 6 - mons.length,
    submit: (data) => dispatch('submit', data)
  })
</script>

<button
  on:click|preventDefault={onopen}
  aria-label="Add Pokemon to your team"
>
  <slot />
</button>
