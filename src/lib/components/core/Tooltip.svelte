<script>
  import { onMount } from 'svelte'
  export let delay = 50

  let loaded = false
  let tippy

  onMount(() => {
    import('tippy.js/dist/tippy.css')
    import('tippy.js').then((m) => {
      tippy = m.default
      loaded = true
    })
  })

  const init = (node, options) => {
    const instance = tippy(
      node.parentNode,
      Object.assign(
        {
          delay: [delay, 0],
          allowHTML: true,
          content: node.innerHTML,
          onCreate() {
            if (
              node.parentNode &&
              typeof node.parentNode.removeChild == 'function'
            )
              node.parentNode.removeChild(node)
          }
        },
        options
      )
    )

    return {
      destroy() {
        instance.destroy()
      }
    }
  }
</script>

{#if loaded}
  <div use:init><slot /></div>
{/if}

<style lang="postcss">
  div {
    display: none;
  }
</style>
