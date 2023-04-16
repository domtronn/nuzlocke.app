<script>
  import { PIcon } from '$c/core'
  import { capitalise, regionise } from '$utils/string'

  export let name, i
  export let weakPct = null, immunePct = null, resistPct

  const IconMap = ['dire-hit-1', 'x-sp-def-2', 'x-attack-3']
  function fmtPct (n) { return  Math.floor(n * 100) + '%' }
</script>

<li class='relative flex flex-col items-center text-xs justify-center'>
  <p class='flex flex-col-reverse'>
    <PIcon {name} class='!w-8 !h-16 mr-2 scale-125' />
    <PIcon type=item name='wonder-launcher-{IconMap[i]}' class='-mb-4 -mt-2' />
  </p>

  <p class='h-full justify-start -mt-4 flex flex-col'>
    <b>{capitalise(regionise(name))}</b>

    <!-- <span><b>Resists:</b> <i>{fmtPct(resistPct)}</i></span> -->
    <!-- {#if weakPct > 0}<span><b>Weak:</b> <i>{fmtPct(weakPct)}</i></span>{/if} -->
    <!-- {#if immunePct > 0}<span><b>Immune:</b> <i>{fmtPct(immunePct)}</i></span>{/if} -->
  </p>
</li>
