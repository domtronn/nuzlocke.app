<script>
  export let name, accuracy, pp, power, type, damage_class
  import { capitalise, unslugify } from '$lib/utils/string'
  import TypeBadge from '$lib/components/type-badge.svelte'
</script>

<div class='my-2'>
  <p class='text-sm mb-1'>
    <span>{unslugify(capitalise(name))}</span>
    {#if power}<span class='font-bold'>{power}</span>{/if}
  </p>

  <div class='flex gap-x-1 justify-start'>
    <TypeBadge type={type} />
    <TypeBadge type={damage_class} />
  </div>
</div>
