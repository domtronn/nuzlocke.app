<script>
  import { FormalInvitation as Pattern } from '$lib/utils/pattern'
  import { Tooltip } from './core'

  export let segments
  $: max = segments.reduce((acc, it) => acc + (it.value ? 1 : 0), 0)
  $: counted = segments.reduce((acc, { type, value }) => ({
    ...acc,
    [type]: (acc[type] || 0) + (value ? 1 : 0)
  }), {})

</script>

<div class='w-full max-w-md mx-auto bg-gray-900 ring-8 ring-gray-800 shadow-lg relative h-4 border border-gray-200 rounded-md flex overflow-hidden'>
  {#each Object.entries(counted) as [type, amt]}
    <span
      class='{type} h-full'
      style='width: {(amt / segments.length) * 100}%;'
    >
      <Tooltip>{type} victories: {amt}</Tooltip>
    </span>
  {/each}
  <p
    class='h-full absolute left-0 pointer-events-none'
    style='width: {max / segments.length * 100}%; animation-duration: {(max / segments.length) * 60}s; background-image: url("{Pattern('rgba(255, 255, 255, 0.2)')}")'
  />
</div>
<span class='absolute left-1/2 -translate-x-1/2 px-4 pb-2 -mt-2 shadow-lg bg-gray-800 translate-y-4 rounded-b-lg '>Progress: <b>{Math.ceil(max / segments.length * 100)}%</b></span>

<style>
  .gym-leader { @apply bg-orange-400; }
  .elite-four { @apply bg-orange-500; }
  .evil-team { @apply bg-orange-200; }
  .rival { @apply bg-orange-300; }
  span, p {
    transition: width 0.2s ease;
  }

  p {
    animation: animatedBackground 30s linear infinite forwards;
  }

  @keyframes animatedBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 1000% 0;
  }
}

</style>
