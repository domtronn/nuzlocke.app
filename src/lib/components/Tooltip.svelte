<script>
  const init = (node, options) => {
    if (typeof tippy === 'undefined') return console.error('Tippy is undefined - tooltips will not work')

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

<div use:init><slot /></div>

<style>
  div { display: none; }
</style>
