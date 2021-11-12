<script>
  export let base, evolutions, select = _ => _

  import { capitalise } from '$lib/utils/string'

  import Picon from '$lib/components/pokemon-icon.svelte'
  import Icon from 'svelte-icons-pack'
  import Bubbles from 'svelte-icons-pack/ri/RiBusinessBubbleChartFill'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const handleSelect = (d) => () => {
    select(d)
    close()
  }

</script>

<div class='flex flex-col items-center dark:bg-gray-900 bg-gray-50 rounded-lg p-8 mx-auto shadow-lg border dark:text-gray-200 dark:border-gray-600'>
  {capitalise(base)} is evolving!

  <span class='relative text-base mb-8 mt-2'>
    <Icon src={Bubbles} size='4rem' className='animate-spin-slow-2 text-orange-200 dark:text-gray-800 fill-current absolute top-0 left-0' />
    <span class='animate-spin-slow absolute -top-2 -left-2'>
      <Icon src={Bubbles} size='5rem' className='rotate-45 text-yellow-200 dark:text-gray-700 fill-current' />
    </span>
    <span>
      <Picon name={base} className='absolute inset-0 transform scale-250' />
      <Picon name={base} className='filter brightness-200 saturate-0 transform scale-250 animate-full-pulse' />
    </span>
  </span>

  <div class='inline-flex gap-x-12'>
    {#each evolutions as e}
      <button aria-label="Evolve {base} into {e}" on:click={handleSelect(e)}>
        <Picon name={e} />
      </button>
    {/each}
  </div>
</div>

<style>
  @keyframes shake {
    0%, 50% { transform: scale(2.2) rotate(0);}
    5%, 45% { transform: scale(2.2) rotate(-2deg);}
    10%, 40% { transform: scale(2.2) rotate(2deg);}
    15%, 25%, 35% { transform: scale(2.2) rotate(-5deg);}
    20%, 30% { transform: scale(2.2) rotate(5deg);}
  }

  button {
    transform: scale(2);
    transition: transform 0.2s ease;
  }

  button:hover {
    cursor: pointer;
    transform: scale(2.2);
    animation: shake 3.2s cubic-bezier(.36,.07,.19,.97) infinite;
  }
</style>
