<script>
  export let base, evolutions, select = _ => _

  import { capitalise } from '$lib/utils/string'
  import { Input, Button } from '$lib/components/core'

  import Picon from '$lib/components/core/PokemonIcon.svelte'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Bubbles } from '$icons'

  import { getContext } from 'svelte'
  const { close } = getContext('simple-modal')
  const handleSelect = (d) => () => {
    select(d)
    close()
  }



  const TokenisedLossSentiments = [
    `After foolishly sending in a <POKEMON TYPE>-type <POKEMON NAME> to battle against an <OPPONENT TYPE>-type, the trainer was shocked when their opponent's <OPPONENT POKEMON> easily defeated them.`,
    `Despite their best efforts, the trainer's <POKEMON NAME> was no match for the opponent's <OPPONENT NAME>, who easily took down the <POKEMON TYPE>-type with a powerful <OPPONENT ATTACK> attack.`,
    `The trainer's overconfidence led them to underestimate their opponent's <OPPONENT NAME>, resulting in the humiliating death of their own <POKEMON NAME>.`,
    `In a moment of panic, the trainer accidentally commanded <POKEMON NAME> to use a <POKEMON ATTACK TYPE>-type move against a <OPPONENT>-type opponent, resulting in a their untimely demise.`,

    `In their battle against the <OPPONENT SPECIALITY><OPPONENT GROUP><OPPONENT NAME>, the trainer's <POKEMON NAME> was quickly defeated by a well-placed <OPPONENT ATTACK> attack.`,

    ``

  ]


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
