<script>
  export let name, className = '', type = 'm'
  import { fade } from 'svelte/transition'
</script>

<span class='pk{type}-wrapper {className}'>
  <i class='pk{type} pk{type}-{name}' />
  <slot />
</span>
