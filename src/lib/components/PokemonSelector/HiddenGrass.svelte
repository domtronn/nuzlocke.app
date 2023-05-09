<script>
  export let sprite, name

  import { Icon, PIcon } from '$c/core'
  import { LongGrass } from '$icons'
</script>

<button
  class="group relative col-span-2 m-0 inline-flex w-11/12 items-center justify-between overflow-hidden rounded-lg border-2 pr-3 transition-colors hover:border-lime-500 dark:border-gray-600 dark:bg-transparent dark:hover:border-lime-400 dark:hover:bg-gray-700/25 sm:w-full sm:text-xs"
  on:click
>
  <div
    class="inline-flex items-center opacity-50 blur grayscale dark:opacity-100"
  >
    <PIcon className="-my-2 sm:-my-3 -mx-2" name={sprite} />
    <span>{name}</span>
  </div>
  <span
    class="tracking-wide text-gray-400 group-hover:text-lime-500 dark:text-gray-200 dark:group-hover:text-lime-400"
    >Reveal</span
  >
  <Icon
    icon={LongGrass}
    height="1.4rem"
    class="absolute left-0.5 -bottom-1.5 text-gray-200 transition-colors group-hover:animate-shake group-hover:text-lime-400 dark:text-gray-700 dark:group-hover:text-lime-500 max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500"
  />
  <Icon
    icon={LongGrass}
    height="1.4rem"
    class="absolute left-7 -bottom-1.5 text-gray-200 transition-colors group-hover:animate-shake group-hover:text-lime-400 dark:text-gray-700 dark:group-hover:text-lime-500 max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500"
  />
  <Icon
    icon={LongGrass}
    height="2.5rem"
    class="absolute left-1.5 -bottom-3 text-gray-300 transition-colors group-hover:animate-shake group-hover:text-lime-500 dark:text-gray-600 dark:group-hover:text-lime-400 max-sm:animate-shake max-sm:text-lime-500 dark:max-sm:text-lime-400"
  />
</button>
