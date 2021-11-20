<script>
  export let name, className = '', type = 'm'
</script>

<span class='pk{type}-wrapper {className}'>
  <i class='pk{type} pk{type}-{name}' />
  <slot />
</span>
