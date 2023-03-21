<script>
  import { Tokens, format, randomTemplate, ELossType } from './prose'
  import { IconButton, Tabs, PIcon } from '$c/core'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  import { Grave, Dice } from '$icons'

  export let pokemon, nickname, ctx, custom = false
  export let base = randomTemplate(ELossType.Dramatic)
  let textContent

  const onkeydown = (e) => custom = true
  const onrandom = () => {
    custom = false
    base = randomTemplate(category)
  }

  const tabs = [
    { label: 'Dramatic', val: ELossType.Dramatic },
    { label: 'Sacrifice', val: ELossType.Sacrifice },
    { label: 'Mistake', val: ELossType.Mistake  },
    { label: 'Bad Luck', val: ELossType.Luck },
  ]

  export let content, editor, category, text

  $: text = format(base, { ...ctx, nickname, pokemon })

  let prevCategory
  $: {
    if (prevCategory !== category) {
      base = randomTemplate(category)
      text = format(base, { ...ctx, nickname, pokemon })
      prevCategory = category
    }
  }

</script>

<h2 class='text-base md:text-2xl -mb-3 md:mt-0 text-center md:mb-4 px-4'>
    <Icon icon={Grave} class='inline mb-1 -ml-4 ' />
    {(nickname ? (nickname + ' the ') : '') + pokemon.name}
</h2>


<div class='text-base md:text-xl bg-gray-100 dark:bg-gray-800 px-2 py-3 md:px-4 md:pt-10 md:pb-4 rounded-lg w-full text-center relative mt-6'>
  <PIcon
    className='grayscale absolute top-0 transform md:scale-200 -translate-y-8 md:-translate-y-1/2 right-8 md:left-1/2 md:-translate-x-1/2 pointer-events-none'
    name={pokemon.alias}
  />

  <span
    class='min-w-[10ch] select-text border-transparent px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:underline decoration-orange-300 dark:decoration-orange-400 underline-offset-4 outline-none'
    tabIndex='0'
    spellcheck=false
    contenteditable
    bind:this={content}
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


  <Tabs
    bind:selected={category}
    className='!gap-x-2 mt-4 -mb-3 !w-full md:-mb-4 w-full flex justify-center'
    labelClassName='text-xs md:pb-1'
    {tabs}
  />

</div>

<small class='hidden md:inline italic text-xs text-gray-400 dark:text-gray-600'>
  <slot name='subtitle' />
</small>
