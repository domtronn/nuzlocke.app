<script>
  import { Tokens, format, randomTemplate, ELossType } from './prose'
  import { IconButton, Tabs, PIcon } from '$c/core'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'

  import { Grave, Dice, Edit } from '$icons'

  export let pokemon, nickname, ctx, custom = false
  export let base = randomTemplate(ELossType.Random)
  let textContent

  const onkeydown = (e) => custom = true
  const onrandom = () => {
    custom = false
    base = randomTemplate(category)
  }

  const onedit = () => {
    const range = document.createRange()
    const sel = window.getSelection()

    const [child] = content.childNodes

    if (child) {
      range.setStart(child, child?.textContent.length - 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }

    content.focus()
  }


  const tabs = [
    { label: 'Random', val: ELossType.Random },
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

<h2 class='text-lg md:text-2xl md:mt-0 text-left md:text-center md:mb-8 px-4'>
    <Icon icon={Grave} class='inline mb-1 -ml-4 ' />
    {(nickname ? (nickname + ' the ') : '') + pokemon.name}
</h2>

<div class='md:hidden h-px w-full my-2 dark:bg-gray-500 bg-gray-500' />

<div class='text-base md:text-xl bg-gray-100 dark:bg-gray-800 p-4 py-5 md:pt-10 rounded-lg w-full text-center relative mt-4 md:mt-6'>
  <PIcon
    className='grayscale absolute -top-3 md:top-0 transform md:scale-200 -translate-y-full md:-translate-y-1/2 right-4 md:left-1/2 md:-translate-x-1/2 pointer-events-none'
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
    containerClassName='absolute bottom-0 max-md:left-0 md:right-0'
    title='Generate random epitaph'
    />

  <span class='md:hidden'>
    <IconButton
      rounded
      borderless
      color=orange
      src={Edit}
      tabIndex=-1
      on:click={onedit}
      containerClassName='absolute bottom-0 right-0'
      title='Edit epitaph'
      />
    </span>

  <Tabs
    bind:selected={category}
    className='!gap-x-2 mt-4 -mb-3 !w-full md:-mb-4 w-full justify-center hidden md:flex'
    labelClassName='text-xs md:pb-1'
    {tabs}
  />

</div>

<small class='hidden md:inline italic text-xs text-gray-400 dark:text-gray-600'>
  <slot name='subtitle' />
</small>
