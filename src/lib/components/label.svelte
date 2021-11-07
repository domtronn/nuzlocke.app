<script>
  export let heading, body
</script>

<div class='h-10 w-10 md:h-14 md:w-14 flex flex-col text-center justify-center text-gray-500 px-2 py-1 border-2 dark:border-gray-700 border-gray-300 shadow-md rounded-lg'>
  <span class='text-xxs leading-3 font-bold -mb-1'>{heading}</span>
  <span class='font-bold text-lg md:text-2xl'>{body}</span>
</div>
