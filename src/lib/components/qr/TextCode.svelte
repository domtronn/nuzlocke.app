<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let code
  let vals = [], refs = []

  $: code = vals.filter(i => i).join('')
  $: if (code.length === 8) {
    dispatch('code', { code })
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
      class='w-8 h-10 md:w-12 md:h-16 text-2xl md:text-4xl !p-0 font-bold text-center uppercase rounded-lg dark:bg-gray-900 text-white !p-0'
      maxlength=1
      on:input={nextref(i)}
      bind:this={refs[i]}
      bind:value={vals[i]}
      />
    {/each}
</div>
