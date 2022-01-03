<script>
  export let icons, size, color, scale = _ => 0
  import { onMount } from 'svelte'

  const sizes = { base: 80, sm: 64, lg: 128, xs: 48}
  const dim = sizes[size]
  const amount = Math.floor(Math.sqrt(dim))

  let Rain
  onMount(() => {
    import('$lib/components/particles')
      .then(m => Rain = m.Rain)
  })
</script>

<div class='{size} {color}'>
  <p role=img class='z-20 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
    <slot />
  </p>
  {#if Rain}
    {#if icons[0]}
      <Rain {amount} {scale} width={dim} height={dim} icons={icons[0]} className=z-30 />
      <Rain {amount} {scale} width={dim} height={dim} icons={icons[0]} className=z-10 />
    {/if}
    {#if icons[1]}
      <Rain {amount} {scale} width={dim} height={dim} icons={icons[1]} className='z-10 hue-rotate-180 brightness-150' />
      <Rain {amount} {scale} width={dim} height={dim} icons={icons[1]} className='z-30 brightness-125' />
      <Rain {amount} {scale} width={dim} height={dim} icons={icons[1]} className='z-10 hue-rotate-90 brightness-150' />
    {/if}
  {/if}
</div>

<style>
  div { @apply relative overflow-hidden; flex-shrink: 0}
  .base { @apply w-20 h-20 text-5xl }
  .sm { @apply w-16 h-16 text-4xl }
  .xs { @apply w-12 h-12 text-2xl }
  .lg { @apply w-32 h-32 text-6xl }

  .yellow { @apply bg-yellow-200 }
  .blue { @apply bg-blue-200 }
  .red { @apply bg-red-400 }
</style>
