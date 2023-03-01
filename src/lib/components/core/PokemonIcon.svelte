<script>
  export let name, className = '', type = 'm'
</script>

<span class='pk{type}-wrapper {className}'>
  {#if type === 'm'}
    <i class='pkmn {name}' />
  {:else }
    <i class='pk{type} pk{type}-{name}' />
  {/if}
  <slot />
</span>
