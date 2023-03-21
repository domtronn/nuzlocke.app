<script>
  export let submit = _ => _, pokemon, nickname

  import Form from './Form.svelte'
  import Prose from './Prose.svelte'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { IconButton } from '$lib/components/core'
  import { Grave, X } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')

  const onsubmit = (data) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    submit(data)
    close()
  }

  let formData = {}, epitaph, custom
</script>

<section class='md:w-[50ch] text-center items-center dark:bg-gray-900 bg-white rounded-lg p-4 md:p-8 mx-auto shadow-lg dark:text-gray-200'>
  <IconButton
    rounded borderless color=orange
    src={X} on:click={close}
    tabIndex=3
    containerClassName='absolute top-2 right-2'
    title='Close modal'
  />

  <h2 class='text-2xl mb-4'>
    <Icon icon={Grave} class='inline mb-1 -ml-4 ' />
    {(nickname ? (nickname + ' the ') : '') + pokemon.name}
  </h2>

  <Prose {nickname} {pokemon} ctx={formData}
         bind:content={epitaph}
         bind:custom>
    <svelte:fragment slot=subtitle>
      Click the text above to make changes, or write your own
    </svelte:fragment>
  </Prose>

  <div class='h-px my-4 w-full dark:bg-gray-700 bg-gray-200' />

  <Form
    pokemon={pokemon?.name}
    on:skip={onsubmit()}
    on:submit={onsubmit({ ...formData, custom, epitaph })}
    bind:formData
  />

</section>
