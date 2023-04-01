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
    console.log(mons, availableMons)
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

<section class='bg-white px-6 py-8 rounded-xl text-xl dark:bg-gray-900 dark:text-gray-50 shadow-lg'>
  <IconButton
    rounded borderless color=orange containerClassName='absolute top-2 right-2'
    src={X} on:click={close}
    tabIndex=3
    title='Close modal'
    />
  
  <h2>Search for a Pokemon to add to your team</h2>
  <p class='text-gray-400 text-base' >Select up to {max} Pokemon to add to your team.</p>
  
  <div class='grid grid-cols-6 bg-gray-200 dark:bg-gray-800 px-6 py-4 mx4 mt-6 mb-4 h-fit overflow-hidden rounded-lg'>
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

  {#if selectedMons.length}
    <p class='text-gray-400 text-base mb-4'>
      Add {selectedMons
      .map(m => capitalise(regionise(m.pokemon)))
      .join(', ')
      .replace(/^(.*), /, '$1 and ')} to your team
    </p>
  {/if}
  
  <div class='flex flex-row-reverse gap-x-4'>
    <Button className='flex-1' wide rounded disabled={ids.length === 0} on:click={onsubmit}>
      <small>Add to your team</small>
    </Button>
    
    <Button className='flex-1' solid wide rounded on:click={close}>
      <small>Cancel</small>
    </Button>
  </div>
  
</section>

<style>
  button:not(.selected):hover :global(.pkm){
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

  button:not(.selected):hover::before {
    @apply bg-gray-300;
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
