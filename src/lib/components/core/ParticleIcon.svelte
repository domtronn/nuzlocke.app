<script>
  import PIcon from './PokemonIcon.svelte'
  import Particles from './../particles'

  export let name, icons = [name], type = 'item', className = ''
  let show = 0, showTimeout
  const onclick = () => {
    clearTimeout(showTimeout)
    showTimeout = setTimeout(_ => { show = 0 }, 901)
    show += 1
  }
</script>

<span class='relative cursor-pointer' on:click={onclick}>
  {#each Array(show).fill() as _, s}
    <Particles
      timeout={600}
      {type}
      {icons}
    />
  {/each}
  {#if $$slots.default}
    <slot />
  {:else}
    <PIcon {className} {type} {name} />
  {/if}
</span>
