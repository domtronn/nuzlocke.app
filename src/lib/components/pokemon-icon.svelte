<script>
  export let name, className
</script>

<span class='pkm-wrapper {className || ''}'>
  <i class='pkm pkm-{name}' />
  <slot />
</span>
