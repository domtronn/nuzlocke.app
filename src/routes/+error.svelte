<script>
  import { page } from '$app/stores';
  export let text = '#3294ee', img = 'https://img.nuzlocke.app/sprite/202.png'
</script>


<div style='color: {text};' class='font-mono max-w-lg mx-auto text-center flex flex-col items-center justify-center'>
  <span class='z-20 relative mt-48'>
    <span class='_centre text-8xl drop-shadow-text absolute -translate-y-full -translate-x-1/2 top-3 -rotate-6'>?</span>
    <span class='_right text-7xl drop-shadow-text absolute translate-x-8 -translate-y-full top-5 rotate-12'>?</span>
    <span class='_left text-6xl drop-shadow-text absolute -translate-x-full -ml-10 -translate-y-full top-4 -rotate-12'>?</span>
    <span class=''>
      <h1 class='tracking-wide drop-shadow-text translate-y-56 font-bold text-6xl'>{$page.status}</h1>
      <h2 class='mb-4 text-xl font-sans dark:text-gray-400 text-gray-800 font-medium tracking-wide translate-y-56'>{$page.error.message}</h2>

      <p class='mx-auto font-sans dark:text-gray-400 text-gray-800 translate-y-56'>
        Oh no! Something's gone wrong.
      </p>
      <p class='mx-auto max-w-sm sm:max-w-md font-sans dark:text-gray-400 text-gray-800 translate-y-56'>
        Try <b>reloading the page</b>, if the problem persists report the bug on
        <a class='underline hover:text-pink-500 transition' href='https://discord.gg/gtdceegtYB' target=_blank rel=noreferrer>Discord</a>.
      </p>
    </span>
  </span>
  <img src={img} alt='wobuffet' class='-mt-16 w-96 mx-auto drop-shadow-md -translate-y-1/2 z-0' />
</div>

<style lang="postcss">
  img { image-rendering: pixelated; }
</style>
