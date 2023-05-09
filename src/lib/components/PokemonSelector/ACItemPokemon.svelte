<script>
  import { PIcon, Icon } from '$c/core'
  import { Search } from '$icons'

  export let item, label, dupes, slot
  export let dupelines = new Set(),
    selected = null,
    iconClass = ''

  const isdupe = dupelines.has(item?.evoline)
</script>

{#if slot === 'item'}
  <span
    class="flex h-8 items-center px-4 py-5 md:py-6"
    class:hidden={dupes === 2 && isdupe}
    class:dupe={dupes === 1 && isdupe}
    aria-label={label}
  >
    <PIcon name={item?.sprite} className="transform -mb-4 -ml-6 -mt-5 -mr-2" />

    {@html label}

    {#if dupes === 1 && isdupe}
      <span class="dupe__span absolute right-4 text-tiny"> dupe </span>
    {/if}
  </span>
{:else if slot === 'icon'}
  {#if selected}
    <PIcon class={iconClass} name={selected?.sprite} />
  {:else}
    <Icon
      inline
      icon={Search}
      class="absolute left-3 top-3 z-20 fill-current text-gray-500"
    />
  {/if}
{/if}

<!-- <svelte:fragment slot="icon" let:iconClass> -->
<!--   {#if selected} -->
<!--     <div class="absolute left-4 top-2 z-50"> -->
<!--       {#if statusComplete} -->
<!--         <Particles -->
<!--           amount={Math.round(Math.random() * 4) + -->
<!--             Math.pow(statusComplete.length, 2)} -->
<!--           icons={statusComplete} -->
<!--           on:end={() => (statusComplete = false)} -->
<!--         /> -->
<!--       {/if} -->
<!--     </div> -->

<!--     <PIcon -->
<!--       name={selected.sprite} -->
<!--       className="{gray ? 'grayscale' : ''} {iconClass}" -->
<!--     /> -->
<!--   {:else} -->
<!--     <Icon -->
<!--       inline={true} -->
<!--       height="0.7em" -->
<!--       icon={Search} -->
<!--       class="left-3 fill-current text-gray-500 {iconClass}" -->
<!--     /> -->
<!--   {/if} -->
<!-- </svelte:fragment> -->
