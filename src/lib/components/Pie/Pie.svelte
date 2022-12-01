<script>
  import Segment from './Segment.svelte'
  export let size = 160, data = []

  const last = arr => arr[arr.length - 1]
  const [result] = data.reduce(([arr, val], it, i, oarr) => {
    const over50 = val < 50 && val + it.value > 50
    const item = { ...it, offset: val, over50 }
    return [arr.concat(item), val + it.value]
  }, [[], 0])

</script>

<div style='--size: {size}'>
  {#each result as segment}
    <Segment {...segment} />
  {/each}
</div>

<style>
  div {
    border-radius: 100%;
    overflow: hidden;
    position: relative;
    height: calc(var(--size) * 1px);
    width: calc(var(--size) * 1px);
  }


  div::after {
    @apply left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
    position: absolute;
    border-radius: 100%;
    content: '';
    background-color: white;
    height: calc(var(--size) * 1px - 40px);
    width: calc(var(--size) * 1px - 40px);
  }

</style>
