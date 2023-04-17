<script>
  import { Icon } from '$c/core'
  import { Loop, Ball } from '$icons'
</script>

<div class="relative z-50 -mb-4 inline-block h-8 w-8 {$$restProps.class || ''}">
  <span class="hidden pl-1 md:flex">
    <Icon
      inline
      class="absolute rounded-full bg-white dark:bg-gray-900"
      height="1.4em"
      icon={Loop}
    />
    <Icon
      inline
      class="absolute -top-[1.5px] right-1 rounded-full bg-white dark:bg-gray-900"
      height="0.8em"
      icon={Ball}
    />
    <Icon
      inline
      class="absolute bottom-2 left-0.5 rounded-full bg-white dark:bg-gray-900"
      height="0.8em"
      icon={Ball}
    />
  </span>
  <p
    class="absolute left-1.5 bottom-1 font-mono text-2xl drop-shadow-text md:bottom-7"
  >
    vs
  </p>
</div>
