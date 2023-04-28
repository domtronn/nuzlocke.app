<script>
  import { PIcon } from '$c/core'
  import { capitalise, regionise } from '$utils/string'

  export let name, i
  // export const weakPct = null
  // export const immunePct = null,
  // export const resistPct

  const IconMap = ['dire-hit-1', 'x-sp-def-2', 'x-attack-3']

  function fmtPct(n) {
    return Math.floor(n * 100) + '%'
  }
</script>

<li class="relative flex flex-col items-center justify-start text-xs">
  <p class="flex flex-col-reverse">
    <PIcon {name} class="mr-2 !h-16 !w-8 scale-125" />
    <PIcon
      type="item"
      name="wonder-launcher-{IconMap[i]}"
      class="-mb-4 -mt-2"
    />
  </p>

  <p class="-mt-4 flex h-full flex-col justify-start">
    <b>{regionise(capitalise(name))}</b>

    <!-- <span><b>Resists:</b> <i>{fmtPct(resistPct)}</i></span> -->
    <!-- {#if weakPct > 0}<span><b>Weak:</b> <i>{fmtPct(weakPct)}</i></span>{/if} -->
    <!-- {#if immunePct > 0}<span><b>Immune:</b> <i>{fmtPct(immunePct)}</i></span>{/if} -->
  </p>
</li>
