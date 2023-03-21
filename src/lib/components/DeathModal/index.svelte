<script>
  export let submit = _ => _, pokemon, nickname

  import Form from './Form.svelte'
  import { IconButton, PIcon } from '$lib/components/core'
  import { Dice } from '$icons'

  import { getContext } from 'svelte'
  import { Tokens, format, randomTemplate } from './prose'

  const { close } = getContext('simple-modal')
  const onrandom = () => {
    let temp = base
    base = randomTemplate()
    if (temp === base) onrandom()
  }

  let text, base, contentEditor
  let formData = {}

  const update = () => text = base
  const appendToken = t => () => base += ` ${t} `
</script>

<section class='md:w-[50ch] text-center items-center dark:bg-gray-900 bg-white rounded-lg p-4 md:p-8 md:pb-12 mx-auto shadow-lg  dark:text-gray-200'>
  <h2 class='text-2xl mb-4'>R.I.P. {(nickname ? (nickname + ' the ') : '') + pokemon.name}</h2>

  <p class='text-base md:text-xl bg-gray-100 dark:bg-gray-800 px-2 py-3 md:px-4 md:py-6 rounded-lg w-full relative'>
    <PIcon
      className='grayscale transform scale-200 mb-3 -mt-3 pointer-events-none'
      name={pokemon.alias}
      />

    <br />

    <span
      class='min-w-[10ch] select-text border-transparent px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:underline underline-offset-4 outline-none'
      tabIndex='0'
      bind:this={contentEditor}
      contenteditable
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
      title='Transfer save'
    />
  </p>

  <small class='mt-1 italic text-gray-400 dark:text-gray-600'>
    Click on the epitaph to write your own
  </small>

  <div class='h-px my-4 w-full dark:bg-gray-700 bg-gray-200' />

  <Form
    pokemon={pokemon?.name}
    bind:formData
  />

</section>
