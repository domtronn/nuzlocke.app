<script>
  import { onMount, createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  
  export let src, expected
  let script
  
  onMount(_ => {
    if (expected && window[expected]) return dispatch('loaded')

    script.addEventListener('load', _ => dispatch('loaded'))
    script.addEventListener('error', _ => dispatch('error'))
  })
</script>


<svelte:head>
  <script bind:this={script} {src} />
</svelte:head>
