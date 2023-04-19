<script>
  export let badge, name, team

  import { onMount, createEventDispatcher } from 'svelte'
  import { Button, PIcon } from '$c/core'
  import { toList, regionise, capitalise } from '$lib/utils/string'
  import deferStyles from '$lib/utils/defer-styles'

  const dispatch = createEventDispatcher()
  onMount(async () => {
    deferStyles('/assets/badges.css')
  })

  function format(poke) {
    const nickname = poke.original.nickname

    return (
      (nickname ? nickname + ' the ' : '') +
      regionise(capitalise(poke.original.pokemon))
    )
  }

  const ontoggle = (_) => dispatch('toggle')
  const oncomplete = (_) => dispatch('complete')
</script>

<div
  class="order-3 w-full text-right {$$restProps.class ||
    ''} items-end md:flex md:flex-col"
>
  <p class="text-center text-xs italic opacity-50 md:w-2/3 md:text-right">
    {#if badge}
      Mark <b>{name}</b> as <b>defeated</b> and claim their badge
    {:else}
      Mark <b>{name}</b> as <b>defeated</b>
    {/if}
    with your team of {toList(team.map(format))}
  </p>

  <div class="my-4 flex justify-center gap-x-2 md:justify-end">
    <Button on:click={ontoggle} class="!py-1 text-xs" rounded>
      <slot name="switch-text" />
    </Button>

    <Button
      disabled={!team.length}
      on:click={oncomplete}
      class="claim !py-1 text-xs"
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
