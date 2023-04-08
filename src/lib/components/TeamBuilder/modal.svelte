<script>
  import { capitalise, regionise } from '$utils/string'
  import { PIcon, Icon, Button, IconButton } from '$c/core'
  import { X, Add } from '$icons'
  
  export let max = 6, mons = [], submit
  
  import { getContext } from 'svelte'
  import { getBox } from '$lib/store'
  const { getPkmns } = getContext('game')

  const { close } = getContext('simple-modal')
  
  let box = {}, availableMons = []
  getBox(b => {
    box = b.reduce((acc, it) => ({ ...acc, [it.id]: it }), {})
    availableMons = b.filter(p => !mons.find(m => p.id == m.id))
  })
  
  let selected = new Set([]), selectedMons = [], ids = []
  $: ids = [...selected]
  $: selectedMons = ids.map(id => box?.[id])
  
  const select = (id) => () => {
    selected.has(id)
      ? selected.delete(id)
      : selected.add(id)
    ids = [...selected]
  }
  
  const onsubmit = () => {
    submit(selectedMons)
    close()
  }
  
</script>

<section class='bg-white px-4 py-6 md:px-6 md:py-8 rounded-xl text-xl dark:bg-gray-900 dark:text-gray-50 shadow-lg'>
  {#if availableMons.length > 0}
  <IconButton
    rounded borderless color=orange containerClassName='absolute top-2 right-2'
    src={X} on:click={close}
    tabIndex=3
    title='Close modal'
    />
  
  <h2>Search for a Pokemon to add to your team</h2>
  <p class='text-gray-400 text-base' >
    <b>{selectedMons.length} / {max}</b> Pokémon selected to add to your team. 
  </p>
  
  <div class='grid grid-cols-4 md:grid-cols-6 bg-gray-200 dark:bg-gray-800 px-2 md:px-6 py-4 mx4 my-2 md:my-6 h-fit overflow-hidden rounded-lg'>
    {#each availableMons as mon (mon.id)}
      <button
        class=relative
        disabled={ids.length >= max && !ids.includes(mon.id)}
        class:selected={ids.includes(mon.id)}
        on:click={select(mon.id)}
        >
        <PIcon class='pointer-events-none transform scale-150' name={mon.pokemon} />
      </button>
    {/each}
  </div>

  <p class='text-gray-400 text-base mb-4'>
  {#if selectedMons.length}
      Add {selectedMons
      .map(m => capitalise(regionise(m.pokemon)))
      .join(', ')
  .replace(/^(.*), /, '$1 and ')} to your team
{:else}
  <p class='h-6' />
    {/if}
    </p>
  
  
  
  <div class='flex flex-row-reverse gap-2 md:gap-4'>
    <Button className='flex-1' wide rounded disabled={ids.length === 0} on:click={onsubmit}>
      <small>Add to team</small>
    </Button>
    
    <Button className='flex-1' solid wide rounded on:click={close}>
      <small>Cancel</small>
    </Button>
  </div>
{:else}
  <p class='max-w-[30ch] text-center mb-4'>
    Your have no Pokémon in your box to add to your team, go out and catch some more!
  </p>
    <Button className=w-full solid wide rounded on:click={close}>
      <small>Go back</small>
    </Button>
{/if}
  
</section>

<style>
  button:enabled:not(.selected):hover :global(.pkm){
    animation: shake 3.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  }

  button:before {
    content: '';
    position: absolute;
    border-radius: 100%;
    @apply bg-transparent transition w-14 h-6 left-1/2 -translate-x-1/2 -bottom-2;
  }
  
  button.selected::before {
    @apply bg-gray-400;
  }

  button:not(.selected):enabled:hover::before {
    @apply bg-gray-300;
  }

  :global(.dark) button.selected::before {
    @apply bg-gray-600;
  }

  :global(.dark) button:not(.selected):enabled:hover::before {
    @apply bg-gray-700;
  }

  
  button.selected :global(.pkm) {
    animation: bob 3s ease infinite;
  }

  @keyframes bob {
    0% { transform: translateY(-8px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(-8px); }
  }
  
</style>
