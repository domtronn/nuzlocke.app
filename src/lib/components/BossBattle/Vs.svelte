<script>
  import { Icon } from '$c/core'
  import { Loop, Ball } from '$icons'
</script>

<div
  class="relative z-50 inline-block h-8 w-8 {$$restProps.containerClass || ''} "
>
  <span class="flex pl-1">
    <Icon
      inline
      class="absolute rounded-full  {$$restProps.class ||
        'bg-white dark:bg-gray-900'}"
      height="1.4em"
      icon={Loop}
    />
    <Icon
      inline
      class="absolute -top-[1.5px] right-1 rounded-full  {$$restProps.class ||
        'bg-white dark:bg-gray-900'}"
      height="0.8em"
      icon={Ball}
    />
    <Icon
      inline
      class="absolute bottom-2 left-0.5 rounded-full  {$$restProps.class ||
        'bg-white dark:bg-gray-900'}"
      height="0.8em"
      icon={Ball}
    />
  </span>
  <p class="absolute left-1.5 bottom-7 font-mono text-2xl">vs</p>
</div>
