<script>
  export let heading, body
</script>

<div class='h-12 w-14 md:h-14 md:w-14 flex flex-col text-center justify-center text-gray-500 p-1 md:border-2 dark:border-gray-700 border-gray-300 md:shadow-md rounded-lg'>
  <span class='md:scale-100 text-tiny leading-3'>{heading}</span>
  <span class='font-bold text-2xl'>{body}</span>
</div>
