<script>
  import { page } from '$app/stores'
  export let text = '#3294ee',
    img = 'https://img.nuzlocke.app/sprite/202.png'
</script>

<div
  style="color: {text};"
  class="mx-auto flex max-w-lg flex-col items-center justify-center text-center font-mono"
>
  <span class="relative z-20 mt-48">
    <span
      class="_centre absolute top-3 -translate-y-full -translate-x-1/2 -rotate-6 text-8xl drop-shadow-text"
      >?</span
    >
    <span
      class="_right absolute top-5 translate-x-8 -translate-y-full rotate-12 text-7xl drop-shadow-text"
      >?</span
    >
    <span
      class="_left absolute top-4 -ml-10 -translate-x-full -translate-y-full -rotate-12 text-6xl drop-shadow-text"
      >?</span
    >
    <span class="">
      <h1
        class="translate-y-56 text-6xl font-bold tracking-wide drop-shadow-text"
      >
        {$page.status}
      </h1>
      <h2
        class="mb-4 translate-y-56 font-sans text-xl font-medium tracking-wide text-gray-800 dark:text-gray-400"
      >
        {$page.error.message}
      </h2>

      <p
        class="mx-auto translate-y-56 font-sans text-gray-800 dark:text-gray-400"
      >
        Oh no! Something's gone wrong.
      </p>
      <p
        class="mx-auto max-w-sm translate-y-56 font-sans text-gray-800 dark:text-gray-400 sm:max-w-md"
      >
        Try <b
          ><a href="{$page.url.pathname}?force-pass={+new Date()}"
            >reloading the page</a
          ></b
        >, if the problem persists report the bug on
        <a
          class="underline transition hover:text-pink-500"
          href="https://discord.gg/gtdceegtYB"
          target="_blank"
          rel="noreferrer">Discord</a
        >.
      </p>
    </span>
  </span>
  <img
    src={img}
    alt="wobuffet"
    class="z-0 mx-auto -mt-16 w-96 -translate-y-1/2 drop-shadow-md"
  />
</div>

<style lang="postcss">
  img {
    image-rendering: pixelated;
  }
</style>
