<script>
  import { createEventDispatcher } from 'svelte'
  import { Tabs, Button } from '$c/core'
  import { TrainerForm, EncounterForm, BossForm, Label, Shared as Common } from './Form'

  export let pokemon = 'Snivy'

  let tabs = [
    { label: 'Boss Battle', val: 'boss' },
    { label: 'Wild Pokemon', val: 'encounter' },
    { label: 'Trainer Fight', val: 'trainer' },
  ]

  let ctx = { tab: tabs[0].val }, result = {}

  const EButton = { Skip: 'Skip', Submit: 'Submit' }

  const dispatch = createEventDispatcher()
  const onsubmit = (e) => {
    if (e.submitter.textContent == EButton.Skip) dispatch('skip', ctx)
    if (e.submitter.textContent == EButton.Submit) dispatch('submit', ctx)
  }
</script>

<pre class='bg-black p-2 fixed bottom-0 left-0'>
  {JSON.stringify({...ctx, ...result}, null, 2)}
</pre>

<form class='flex flex-col gap-2 mt-4' on:submit={onsubmit}>
  <Label>What type of encounter did they die to?</Label>

  <Tabs className='my-2'
        labelClassName='text-xs'
        name='mech' bind:selected={ctx.tab} {tabs} />

  <div class='hpx bg-gray-500 w-full' />
    <Common
      bind:from={ctx.fromlvl}
      bind:to={ctx.tolvl}
    >
      <Label slot=label optional>Set capture and defeat level of <mark>{pokemon}</mark></Label>
    </Common>

    {#if ctx?.tab === 'encounter'}
      <EncounterForm bind:result>
        <Label slot=label optional>Set the wild pokémon that defeated <mark>{pokemon}</mark></Label>
      </EncounterForm>
    {:else if ctx?.tab === 'trainer'}
      <TrainerForm bind:result>
        <Label slot=label optional>Set the trainer and the pokémon that defeated <mark>{pokemon}</mark></Label>
      </TrainerForm>
    {:else if ctx?.tab === 'boss'}
      <BossForm bind:result>
        <Label slot=label optional>Set the boss, pokémon, and the move that defeated <mark>{pokemon}</mark></Label>
      </BossForm>
    {/if}

    <div class='mt-2 w-full text-center flex flex-col md:flex-row md:inline-flex gap-2 md:gap-4'>
      <Button tabIndex=-1 rounded className='flex-auto'>
        {EButton.Skip}
      </Button>
      <Button tabIndex=1 rounded solid className='flex-auto'>
        {EButton.Submit}
      </Button>
    </div>

  </form>

<style>
  mark {
    @apply px-2 py-1 rounded-full text-gray-200 bg-gray-700;
  }
</style>
