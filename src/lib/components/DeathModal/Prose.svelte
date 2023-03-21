<script>
  import { Tokens, format, randomTemplate } from './prose'
  import { IconButton, PIcon } from '$c/core'
  import { Dice } from '$icons'

  export let pokemon, nickname, ctx, custom = false
  let base = randomTemplate()
  let textContent

  const onkeydown = (e) => custom = true
  const onrandom = () => {
    custom = false
    base = randomTemplate()
  }

  export let content
  $: content = custom ? textContent : base
  $: text = format(base, { ...ctx, nickname, pokemon })
</script>

<div class='text-base md:text-xl bg-gray-100 dark:bg-gray-800 px-2 py-3 md:px-4 md:pt-8 md:pb-4 rounded-lg w-full text-center relative mt-6'>
  <PIcon
    className='grayscale absolute top-0 transform scale-200 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none'
    name={pokemon.alias}
  />

  <span
    class='min-w-[10ch] select-text border-transparent px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:underline decoration-orange-300 dark:decoration-orange-400 underline-offset-4 outline-none'
    tabIndex='0'
    spellcheck=false
    contenteditable
    bind:textContent={textContent}
    on:keydown={onkeydown}
  >
    {text}
  </span>

  <IconButton
    rounded
    borderless
    color=orange
    src={Dice}
    tabIndex=-1
    on:click={onrandom}
    containerClassName='absolute bottom-0 right-0'
    title='Generate random epitaph'
    />
</div>

<small class=' italic text-xs text-gray-400 dark:text-gray-600'>
  <slot name='subtitle' />
</small>

<style>
  button {
    @apply text-xs rounded-full px-2 py-1
    hover:bg-gray-400 bg-gray-200 text-gray-800;
  }

  :global(.dark) button {
    @apply hover:text-gray-200 hover:bg-gray-900 bg-gray-700 text-black
  }

</style>
