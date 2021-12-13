<script>
  export let base, evolutions, select = _ => _

  import { capitalise } from '$lib/utils/string'
  import { Input, Button } from '$lib/components/core'

  import Picon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from 'svelte-icons-pack'
  import Bubbles from 'svelte-icons-pack/ri/RiBusinessBubbleChartFill'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const handleSelect = (d) => () => {
    select(d)
    close()
  }

</script>

<section class='flex flex-col w-72 items-center dark:bg-gray-900 bg-gray-50 rounded-lg p-8 pb-12 mx-auto shadow-lg border dark:text-gray-200 dark:border-gray-600'>
  <span><strong>R.I.P.</strong></span>

  <form>
    <div class=inline-flex>
      <Input
        rounded
        placeholder='What level did they join you?'
        />
      <Input
        rounded
        placeholder='What level were they killed?'
        />
    </div>
    <Input
      rounded
      placeholder='How did they die?'
      />
  </form>

  <Button rounded className='w-full'>
    Farewell, pokemon
  </Button>

</section>

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
