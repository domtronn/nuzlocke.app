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

  <div in:fade style='max-width: fit-content' class='mx-auto mb-4 mt-3 overflow-hidden rounded-xl shadow-lg bg-yellow-50 flex items-center'>
    <Icon color=yellow size=xs
          icons={[ shardicons, sashicons ]}
          scale={_ => 0.2 + Math.random()}>
      🎉
    </Icon>

    <p style='text-align: left !important; max-width: 300px !important' class='text-gray-800 px-4 max-w-xs'>
      Your box is full of <b>Pokémon</b> that resist <b>every</b> offensive type!
    </p>
  </div>

<p in:fade class='text-center my-4 text-sm'>
  But you have <b>poor</b> coverage against
  {#each weakTypes as type, i}
    <span class=ml-1>
      {#if i === weakTypes.length - 1}
        &
      {/if}
    </span>
    <TypeBadge className='leading-4' {type} />
  {/each}
</p>


  <slot />

{:else}

  <div in:fade style='max-width: fit-content' class='overflow-hidden rounded-xl shadow-lg border dark:border-none flex items-center my-3 bg-red-200 mx-auto'>
    <Icon color=red size=xs
          icons={[]}
          scale={_ => 0.2 + (Math.random() / 10)}>
      😱
    </Icon>

    <div class='px-4 p-2 text-gray-900 text-sm leading-5'>
      <p class='font-bold text-gray-900'>Your team is missing coverage</p>
    </div>
  </div>

  <p class=mb-3>
    Your team has <b class=text-lg>no</b> resistances for <b class=text-lg>{gapTypes.length}</b> types
  </p>

  <slot />

  <p class='mb-2 mt-4' in:fade={{ delay: 1800 }}>
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
