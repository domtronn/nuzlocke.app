<script>
  import Icon from 'svelte-icons-pack'

  import Mobile from 'svelte-icons-pack/ai/AiOutlineMobile'
  import Stop from 'svelte-icons-pack/ai/AiOutlineStop'
</script>

<div class='block xl:hidden absolute inset-0 flex flex-col items-center justify-center text-2xl text-center px-2 max-w-md mx-auto -mt-12'>
  <div class='relative h-32'>
    <Icon size=4em src={Mobile} className='fill-current absolute text-gray-900 dark:text-gray-50 -translate-x-1/2 left-1/2' />
    <Icon size=6em src={Stop} className='fill-current absolute text-hotpink-500 -translate-x-1/2 left-1/2 -translate-y-6' />
  </div>
  <h4 class='tracking-wide mb-4 text-5xl font-bold'>Screen too small</h4>
  <span class='leading-6 text-lg'>
    The <strong>boss editor</strong> isn't available on smaller devices. You need the room of a desktop browser in order to display everything correctly.
  </span>
  <span class='leading-6 text-lg mt-4'>
    Please open this page on a larger device or resize your window!
  </span>
</div>
