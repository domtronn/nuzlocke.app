<script>
  import { onMount, onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'

  import TypeBadge from '$lib/components/type-badge.svelte'
  import Icon from './Icon.svelte'

  export let weakTypes = [], gapTypes = [], suggestions, scale

  const shardicons = [ 'yellow-shard', 'green-shard', 'red-shard']
  const sashicons = [ 'focus-sash', 'red-chain' ]

</script>

{#if !gapTypes.length}
  <div in:fade style='max-width: fit-content' class='mx-auto my-4 overflow-hidden rounded-xl shadow-lg bg-yellow-50 flex mt-4 items-center'>
    <Icon color=yellow size=sm
          icons={[ shardicons, sashicons ]}
          scale={_ => 0.2 + Math.random()}>
      🎉
    </Icon>

    <p style='text-align: left !important; max-width: 300px !important' class='text-gray-800 px-4 max-w-xs'>
      Your box is full of Pokémon that resist every offensive type!
    </p>
  </div>

  <slot />

  <p in:fade={{ delay: 2000 }} class='text-center my-4 text-sm'>
    You could still improve your coverage against
    {#each weakTypes as type, i}
      <span class=ml-1>
        {#if i === weakTypes.length - 1}
          &
        {/if}
      </span>
      <TypeBadge className='leading-4' {type} />
    {/each}
  </p>

{:else}

  <div in:fade style='max-width: fit-content' class='overflow-hidden rounded-xl shadow-lg border flex items-center my-4 mx-auto'>
    <Icon color=blue size=xs
          icons={[ ['great-ball', 'poke-ball', 'net-ball', 'dive-ball'] ]}
          scale={_ => 0.4 + Math.random() / 2}>
      😱
    </Icon>

    <div class='px-4 p-2 text-gray-800 text-sm leading-5'>
      <p class='font-bold hidden text-gray-800 sm:block'>Your team is missing coverage</p>
    </div>
  </div>

  <slot />

  <p in:fade={{ delay: 1600 }}>
    Your team has no resistances for <b class=text-lg>{gapTypes.length}</b> types
  </p>
  <p in:fade={{ delay: 1800 }}>
    You should add some
    {#each suggestions.slice(0, 3) as type, i}
      <span class=ml-1>
        {#if i === 2}or{/if}
      </span>
      <TypeBadge className='leading-4' {type} />
    {/each}
    types to your team to improve your coverage
  </p>
{/if}

<style>
  p {
    @apply text-sm text-center max-w-xs mx-auto leading-5;
  }
</style>
