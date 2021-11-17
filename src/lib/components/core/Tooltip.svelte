<script>
  import { onMount } from 'svelte'

  let loaded = false
  let tippy

  onMount(() => {
    import('tippy.js/dist/tippy.css')
    import('tippy.js').then(m => {
      tippy = m.default
      loaded = true
    })
  })

  const init = (node, options) => {
    const instance = tippy(node.parentNode, Object.assign({
      content: node.innerHTML,
      onCreate() {
        node.parentNode.removeChild(node);
      }
    }, options));

    return {
      destroy() {
        instance.destroy();
      }
    }
  };
</script>

{#if loaded}
  <div use:init><slot /></div>
{/if}

<style>
  div { display: none; }
</style>
