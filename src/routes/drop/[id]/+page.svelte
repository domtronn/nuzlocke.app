<script>
  export let data

  import { updateGame, savedGames, IDS } from '$lib/store'
  import { Loader } from '$c/core'
  import { onMount } from 'svelte'

  let error = false
  onMount(() => {
    if (data.error) return (error = data.error)
    window.localStorage.setItem(
      IDS.game(data.save.id),
      JSON.stringify(data.data)
    )
    savedGames.update(updateGame(data.save))
    window.location = '/saves'
  })
</script>

{#if !error}
  <Loader />
{:else}
  <section class="mx-auto max-w-md text-center">
    <div class="absolute top-1/2 -translate-y-1/2">
      <h2 class="mx-auto font-sans text-2xl text-gray-800 dark:text-gray-400">
        Something's gone wrong reading the import code
      </h2>

      <pre
        class="rounded-lg p-8 text-center font-sans font-medium text-gray-800 dark:text-red-500">{data.error.trim()}</pre>

      <p
        class="mx-auto max-w-sm font-sans text-gray-800 dark:text-gray-400 sm:max-w-md"
      >
        Try <b>scanning the QR Code</b> again, if the problem persists report
        the bug & above error on
        <a
          class="underline transition hover:text-pink-500"
          href="https://discord.gg/gtdceegtYB"
          target="_blank"
          rel="noreferrer">Discord</a
        >.
      </p>
    </div>
  </section>
{/if}

<style lang="postcss">
  img {
    image-rendering: pixelated;
  }
</style>
