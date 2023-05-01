<script>
  import TextCode from './TextCode.svelte'
  import { getContext } from 'svelte'

  import { fly } from 'svelte/transition'

  import { updateGame, savedGames, IDS } from '$lib/store'

  import { Icon, IconButton, Loader } from '$c/core'
  import {
    X,
    QR,
    QRCode,
    Error,
    Share,
    Floppy,
    Transfer,
    Mobile,
    Desktop
  } from '$icons'

  const handlescan = (e) => {
    loading = true
    window.location = `/drop/${e.detail.code}`
  }

  const { close } = getContext('simple-modal')
  let loading = false
  let files, error

  $: if (files) {
    loading = true
    let reader = new FileReader()
    reader.onload = function (e) {
      try {
        const { __meta, ...gameData } = JSON.parse(e.currentTarget.result)

        window.localStorage.setItem(
          IDS.game(__meta.id),
          JSON.stringify(gameData)
        )
        savedGames.update(updateGame(__meta))

        loading = false
        close()
      } catch (e) {
        error = true
        loading = false
        setTimeout(() => (error = false), 3500)
      }
    }
    reader.readAsText(files[0])
  }
</script>

<section>
  <IconButton
    rounded
    borderless
    color="orange"
    containerClassName="absolute top-4 right-4"
    src={X}
    on:click={close}
    tabIndex="3"
    title="Close modal"
  />

  <h1>
    <Icon inline={true} icon={QR} class="-ml-4 mr-2 fill-current md:-ml-6" />
    Import a save
  </h1>

  {#if !loading}
    <p>
      Enter the ShareScreen code, scan the QR code on your Mobile device or
      upload a <mark>.nzsav</mark> file to transfer the save data.
    </p>

    <div
      class="-ml-4 inline-flex scale-75 transform items-center text-4xl md:my-0 md:scale-100"
    >
      <Icon inline={true} height="0.9em" icon={Mobile} class="fill-current" />
      <Icon
        inline={true}
        height="0.6em"
        icon={Transfer}
        class="mr-2 ml-1 fill-current"
      />
      <Icon inline={true} icon={Desktop} class="fill-current" />
    </div>

    <TextCode on:code={handlescan} />

    <ol>
      <li>
        Open your <a href="/saves"
          ><mark
            >Save files <Icon
              inline={true}
              height="0.9em"
              icon={Floppy}
              class="fill-current"
            /></mark
          ></a
        > on your first device
      </li>
      <li>
        Select the <mark
          >Share <Icon inline={true} icon={Share} class="fill-current" /></mark
        > icon on the save you want to transfer
      </li>
      <li>Open <mark>this page</mark> on your second device</li>
      <li>
        Enter the <mark>Code</mark> or scan the
        <mark
          >QR code <Icon
            inline={true}
            icon={QRCode}
            class="fill-current"
          /></mark
        > with your camera
      </li>
    </ol>

    <p class="or text-gray-500"><i>or</i></p>

    <label
      class="mx-4 -mb-4 block w-full cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-gray-400 hover:text-yellow-500 hover:ring-2 hover:ring-yellow-500"
      for="file"
      >Upload <code class="pr-0.5 text-lg">.nzsav</code> file
      <input
        bind:files
        class="hidden"
        accept=".nzsav"
        id="file"
        name="file"
        type="file"
      />
    </label>
  {:else}
    <div class="mt-8 h-32">
      <Loader class="!relative" />
      <i
        class="absolute bottom-10 left-1/2 -translate-x-1/2 text-lg opacity-50"
      >
        Importing...
      </i>
    </div>
  {/if}
</section>

{#if error}
  <div
    transition:fly={{ y: 50 }}
    class="fixed bottom-0 left-0 z-50 w-full px-4 md:left-1/2 md:w-auto md:-translate-x-1/2"
  >
    <div
      class="inline-flex w-full max-w-sm justify-center rounded-t-lg bg-red-100 px-6 py-2 font-bold text-red-600"
    >
      <b class="pr-2">Error:</b> Unable to import saved data
      <Icon inline icon={Error} height="1.4em" class="ml-2 fill-current" />
    </div>
  </div>
{/if}

<style lang="postcss">
  h1 {
    @apply -mb-2 inline-flex items-center text-2xl font-bold md:text-4xl;
  }
  p {
    @apply max-w-md text-center text-sm leading-5;
  }
  ol {
    @apply list-outside list-decimal text-sm leading-4;
  }
  li {
    @apply mb-2 md:mb-1 md:-ml-2 md:pl-2;
  }
  mark {
    @apply mx-px inline-flex items-center gap-x-1 bg-yellow-200 px-1 font-bold leading-5 transition;
  }
  a mark:hover {
    @apply cursor-pointer bg-yellow-400;
  }

  section {
    @apply mx-auto flex flex-col items-center gap-y-4 overflow-hidden rounded-xl bg-gray-50 py-10 px-6 text-gray-800 md:px-12;
  }

  :global(.dark) section {
    @apply bg-gray-800 text-white;
  }

  p.or {
    @apply relative w-3/4 px-10;
  }

  p.or::before {
    content: '';
    @apply absolute left-0 top-1/2 z-0 h-px w-full translate-y-px bg-gray-500 px-8;
  }

  p.or i {
    @apply relative z-10 bg-gray-800 px-2 py-2;
  }
</style>
