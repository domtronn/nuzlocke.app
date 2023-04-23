<script>
  export let submit = (_) => _,
    pokemon,
    nickname,
    death = {},
    mode = 'new'

  import Form from './Form.svelte'
  import Prose from './Prose.svelte'

  import { IconButton } from '$lib/components/core'
  import { X } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')

  const onsubmit = (data) => (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (data)
      submit({
        ...data,
        time: +new Date(),
        epitaph: data?.custom ? epitaphEl.textContent : epitaphBase
      })
    else
      submit({
        time: +new Date()
      })

    close()
  }

  let epitaphEl, epitaphBase
  let formData = {},
    custom,
    category
  $: result = {
    ...formData,
    ...(custom ? { custom: true } : { custom: false, category })
  }
</script>

<section
  class="mx-auto items-center rounded-lg bg-white px-6 pt-4 pb-6 text-center shadow-lg dark:bg-gray-900 dark:text-gray-200 md:w-[50ch] md:p-8"
>
  <IconButton
    rounded
    borderless
    color="orange"
    src={X}
    on:click={close}
    tabIndex="3"
    containerClassName="absolute top-4 right-4"
    title="Close modal"
  />

  <Prose
    {nickname}
    {pokemon}
    ctx={{ ...death, ...formData }}
    epitaph={death?.epitaph}
    bind:category
    bind:content={epitaphEl}
    bind:base={epitaphBase}
    bind:custom
  >
    <svelte:fragment slot="subtitle">
      Click the text above to make changes, or write your own
    </svelte:fragment>
  </Prose>

  <div
    class="hidden h-px w-full bg-gray-200 dark:bg-gray-700 md:my-4 md:block"
  />

  <Form
    pokemon={pokemon?.name}
    class="{mode}-mode"
    on:skip={onsubmit()}
    on:submit={onsubmit(result)}
    bind:formData
  />
</section>
