<script>
  export let submit = _ => _, pokemon, nickname

  import Form from './Form.svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { IconButton, PIcon } from '$lib/components/core'
  import { Dice, Grave } from '$icons'

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
  <h2 class='text-2xl mb-4'>
    <Icon icon={Grave} class='inline mb-1 -ml-4 ' />
    {(nickname ? (nickname + ' the ') : '') + pokemon.name}
  </h2>



  <small class='mt-1 italic text-gray-400 dark:text-gray-600'>
    Click on the epitaph to write your own
  </small>

  <div class='h-px my-4 w-full dark:bg-gray-700 bg-gray-200' />

  <Form
    pokemon={pokemon?.name}
    bind:formData
  />

</section>
