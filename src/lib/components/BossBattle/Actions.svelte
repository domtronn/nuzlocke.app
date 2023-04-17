<script>
  export let badge, name, team

  import { onMount, createEventDispatcher } from 'svelte'
  import { Button } from '$c/core'
  import { toList, regionise, capitalise } from '$lib/utils/string'
  import deferStyles from '$lib/utils/defer-styles'

  const dispatch = createEventDispatcher()
  onMount(async () => {
    deferStyles('/assets/badges.css')
  })

  function format(poke) {
    return (
      poke.original.nickname || regionise(capitalise(poke.original.pokemon))
    )
  }

  const ontoggle = (_) => dispatch('toggle')
  const oncomplete = (_) => dispatch('complete')
</script>

<div class="order-3 w-full {$$restProps.class || ''}">
  <p class=" my-2 text-center text-xs italic opacity-50 md:text-right">
    {#if badge}
      Claim the badge from <b>{name}</b> to mark this boss as <b>defeated</b>
    {:else}
      Mark victory against <b>{name}</b> to mark this boss as <b>defeated</b>
    {/if}
    <br class="hidden md:block" />
    with your team of {toList(team.map(format))}
  </p>

  <div class="my-4 flex justify-center gap-x-2 md:justify-end">
    <Button on:click={ontoggle} class="text-xs md:text-base" rounded>
      <slot name="switch-text" />
    </Button>

    <Button
      on:click={oncomplete}
      class="claim text-xs md:text-base"
      solid
      rounded
    >
      {#if badge}
        Claim badge
        <PIcon class="coin -mt-3 md:ml-2" type="b" name={badge} />
      {:else}
        Mark victory
      {/if}
    </Button>
  </div>
</div>
