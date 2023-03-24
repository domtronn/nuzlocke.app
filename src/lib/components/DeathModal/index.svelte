<script>
  export let submit = _ => _, pokemon, nickname

  import Form from './Form.svelte'
  import Prose from './Prose.svelte'

  import { IconButton } from '$lib/components/core'
  import { X } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')

  const onsubmit = (data) => (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (data) submit({
      ...data,
      time: +new Date(),
      epitaph: data?.custom ? epitaphEl.textContent : epitaphBase
    })
    else submit({
      time: +new Date()
    })

    close()
  }

  let epitaphEl, epitaphBase
  let formData = {}, custom, category
  $: result = {
    ...formData,
    ...(custom ? { custom: true } : { custom: false, category }),
  }

</script>

<section class='md:w-[50ch] text-center items-center dark:bg-gray-900 bg-white rounded-lg px-6 pt-4 pb-6 md:p-8 mx-auto shadow-lg dark:text-gray-200'>
  <IconButton
    rounded borderless color=orange
    src={X} on:click={close}
    tabIndex=3
    containerClassName='absolute top-4 right-4'
    title='Close modal'
  />

  <Prose {nickname} {pokemon} ctx={formData}
         bind:category={category}
         bind:content={epitaphEl}
         bind:base={epitaphBase}
         bind:custom>
    <svelte:fragment slot=subtitle>
      Click the text above to make changes, or write your own
    </svelte:fragment>
  </Prose>

  <div class='hidden md:block h-px md:my-4 w-full dark:bg-gray-700 bg-gray-200' />

  <Form
    pokemon={pokemon?.name}
    on:skip={onsubmit()}
    on:submit={onsubmit(result)}
    bind:formData
  />

</section>
