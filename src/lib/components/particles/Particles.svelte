<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { random } from '$lib/utils/arr'
  import deferStyles from '$lib/utils/defer-styles'

  import Particle from './Particle.svelte'
  import PIcon from '$lib/components/core/PokemonIcon.svelte'

  export let amount = 15, gravity = 3.2, decay = 0.974, timeout = 1200, icons = [], className = '', type = 'item'

  const dispatch = createEventDispatcher()
  const particles = [...Array(amount)]
      .map(() => ({
        icon: random(icons),
        scale: 1 + Math.random() / 3,
        v: (Math.random() * 4) + 5,
        theta: (Math.random() * Math.PI / 3) -((4 * Math.PI) / 6),
      }))

  let show = true
  onMount(() => {
    deferStyles(`/assets/items.css?i=${icons.join(',')}`)
    setTimeout(_ => {
      show = !show
      setTimeout(_ => dispatch('end'), 500)
    }, timeout)
  })
</script>

{#if show}
  {#each particles as p}
    <Particle {...p} g={gravity} decay={decay} className={className}>
      <PIcon name={p.icon} {type} />
    </Particle>
  {/each}
{/if}
