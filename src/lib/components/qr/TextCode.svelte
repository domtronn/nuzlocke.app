<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let code
  let vals = [], refs = []

  $: code = vals.filter(i => i).join('')
  $: if (code.length === 8) {
    dispatch('code', { code })
  }

  const onpaste = e => {
    if (e.type !== 'paste') return
    if (!e.clipboardData.types.includes('text/plain')) return

    const text = e.clipboardData.getData('text/plain')
    vals = text.slice(0, 8)
    refs[Math.min(text.length - 1, 7)]?.focus()
  }

  const nextref = i => e => {
    e.data === null
      ? refs[Math.max(i - 1, 0)].focus()
      : refs[Math.min(i + 1, 7)].focus()
  }

</script>

<div class='inline-flex gap-x-1 md:gap-x-2'>
  {#each Array(8).fill() as _, i}
    <input
      class='w-8 h-10 md:w-12 md:h-16 text-2xl md:text-4xl !p-0 font-bold text-center uppercase rounded-lg bg-gray-200 dark:bg-gray-900 text-black dark:text-white !p-0'
      maxlength=1
      on:paste={onpaste}
      on:input={nextref(i)}
      bind:this={refs[i]}
      bind:value={vals[i]}
      />
    {/each}
</div>
