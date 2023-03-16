<script>
  export let heading, body, className
</script>

<div class='h-12 w-14 md:h-14 md:w-14 flex flex-col text-center justify-center text-gray-800 dark:text-gray-200 p-1 {className}'>
  <span class='md:scale-100 text-tiny leading-3'>{heading}</span>
  <span class='font-bold text-2xl'>{body}</span>
</div>
