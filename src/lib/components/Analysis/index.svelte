<script>
  export let count, analysis, suggestions

  import { flip } from 'svelte/animate'
  import sorts from './_sorts'
  import TypeSummary from './Summary.svelte'
  import TypeMessage from './Message.svelte'

  import { IconButton } from '$lib/components/core'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Analysis } from '$icons'
  import { Sort } from '$icons'

  const weakest = analysis // Calculate the weakest ratio of resists to weaknesses
    .filter(([, { weak, resist }]) => {
      if (weak && resist && weak / resist > 1.5) return true
      if (!resist && weak) return true
    })
    .map(([type]) => type)

  const typegap = analysis // Find types that you don't resist
    .filter(([, { resist }]) => !resist)
    .map(([ type ]) => type)

  let sort = 0
  const sortFns = [sorts.weak, sorts.resist, sorts.ratio]
  const sortDescs = ['Most weaknesses', 'Most resistances', 'Worst coverage']
  const nextsort = _ => sort = (sort + 1) % sortFns.length
  const filter = ([, { weak, resist }]) => weak || resist

</script>

<section class='bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-3 px-3 sm:p-6 rounded-2xl shadow-lg' >
  <div class='flex justify-end items-center mb-2'>
    <h3 class='inline-flex gap-x-1 items-center text-sm'>
      <span class='ml-1 text-gray-500 '>Sorted: </span>
      <strong>{sortDescs[sort]}</strong>
      <IconButton containerClassName='ml-1' rounded src={Sort} on:click={nextsort} />
    </h3>
  </div>

  <TypeMessage
    weakTypes={weakest}
    gapTypes={typegap}
    {suggestions}
  >
    <table>
      <tr>
        <td class='font-bold text-tiny tracking-widest text-right uppercase pr-4'>Weaknesses</td>
        <td class='font-bold text-tiny tracking-widest text-center uppercase border-l border-r border-gray-400'>Types</td>
        <td class='font-bold text-tiny tracking-widest text-left uppercase pl-4'>Resistances</td>
      </tr>
      {#each [...analysis].filter(filter).sort(sortFns[sort]) as [type, data], i (type)}
        <tr animate:flip={{ duration: 500 }} class=py-1>
          <TypeSummary
            {i}
            {type}
            {count}
            {...data}
            />
        </tr>
      {/each}
    </table>
  </TypeMessage>
</section>
