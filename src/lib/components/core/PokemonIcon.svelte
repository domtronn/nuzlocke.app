<script>
  export let name, className = '', type = 'm'
</script>

<span class='pk{type}-wrapper {$$restProps.class || ''} {className}'>
  <i
    class:pkm-sevii={name.includes('sevii')}
    class:pkm-delta={name.includes('delta')}
    class='pk{type} pk{type}-{name}' />
  <slot />
</span>
