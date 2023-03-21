<script>
  export let submit = _ => _, pokemon, nickname

  import Form from './Form.svelte'
  import Prose from './Prose.svelte'
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

<section class='md:w-[50ch] text-center items-center dark:bg-gray-900 bg-white rounded-lg p-4 md:p-8 mx-auto shadow-lg dark:text-gray-200'>
  <h2 class='text-2xl mb-4'>
    <Icon icon={Grave} class='inline mb-1 -ml-4 ' />
    {(nickname ? (nickname + ' the ') : '') + pokemon.name}
  </h2>

  <Prose {nickname} {pokemon} ctx={formData}>
    <svelte:fragment slot=subtitle>
      Click the text above to make changes, or write your own
    </svelte:fragment>
  </Prose>

  <div class='h-px my-4 w-full dark:bg-gray-700 bg-gray-200' />

  <Form
    pokemon={pokemon?.name}
    bind:formData
  />

</section>
