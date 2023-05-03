<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let code
  let vals = [],
    refs = []

  const codeLength = 6

  $: code = vals.filter((i) => i).join('')
  $: if (code.length === codeLength) {
    dispatch('code', { code })
  }

  const onpaste = (e) => {
    if (e.type !== 'paste') return
    if (!e.clipboardData.types.includes('text/plain')) return

    const text = e.clipboardData.getData('text/plain')
    vals = text.slice(0, codeLength).split('')
    refs[Math.min(text.length - 1, codeLength - 1)]?.focus()
  }

  const nextref = (i) => (e) => {
    e.data === null
      ? refs[Math.max(i - 1, 0)].focus()
      : refs[Math.min(i + 1, codeLength - 1)].focus()
  }

  const handlekey = (i) => (e) => {
    if (e.key === 'Backspace') refs[Math.max(i - 1, 0)].focus()
  }
</script>

<div class="inline-flex gap-x-1 md:gap-x-2">
  {#each Array(codeLength).fill() as _, i}
    <input
      class="h-10 w-8 rounded-lg bg-gray-200 !p-0 !p-0 text-center text-2xl font-bold uppercase text-black dark:bg-gray-900 dark:text-white md:h-16 md:w-12 md:text-4xl"
      maxlength="1"
      on:paste={onpaste}
      on:keydown={handlekey(i)}
      on:input={nextref(i)}
      bind:this={refs[i]}
      bind:value={vals[i]}
    />
  {/each}
</div>
