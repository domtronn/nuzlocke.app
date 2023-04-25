<script>
  export let name = 'unknown-pokemon2',
    className = '',
    type = 'm'
</script>

<span class="pk{type}-wrapper {$$restProps.class || ''} {className}">
  <i
    class:pkm-sevii={name?.includes('sevii')}
    class:pkm-hoennian={name?.includes('-hoenn')}
    class="pk{type} pk{type}-{name}"
  />
  <slot />
</span>
