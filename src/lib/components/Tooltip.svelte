<script>
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';

  const init = (node, options) => {
    if (typeof tippy === 'undefined') return console.error('Tippy is undefined - tooltips will not work')

    const instance = tippy(node.parentNode, Object.assign({
      content: node.innerHTML,
      animation: 'scale',
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
