<script>
  import { createEventDispatcher } from 'svelte'
  import { isEmpty, nonnull } from '$utils/obj'
  import { Tabs, Button } from '$c/core'
  import { TrainerForm, EncounterForm, BossForm, Label, Shared as Common } from './Form'

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

  export let pokemon = 'Snivy'
  export let formData

  const toSpreadable = (o, key) => isEmpty(nonnull(o)) ? {} : { [key]: nonnull(o) }

  $: formData = nonnull({
    type: ctx?.tab,
    ...(toSpreadable({ from: ctx?.fromlvl, to: ctx?.tolvl }, 'lvl')),
    ...(toSpreadable(result?.pokemon, 'opponent')),
    ...(toSpreadable(result?.location, 'location')),
    ...(toSpreadable(result?.trainer, 'trainer')),
    ...(toSpreadable(result?.attack, 'attack')),
  })

</script>

<form class='flex flex-col gap-2 mt-4 w-full text-left' on:submit={onsubmit}>
  <Label>Set the encounter type</Label>
  <Tabs labelClassName='text-sm' name='mech' bind:selected={ctx.tab} {tabs} />

  <div class='hpx bg-gray-500 w-full' />
    <Common
      bind:from={ctx.fromlvl}
      bind:to={ctx.tolvl}
    >
      <Label slot=label optional>Set capture and defeat level of <b>{pokemon}</b></Label>
    </Common>

    {#if ctx?.tab === 'encounter'}
      <EncounterForm bind:result>
        <Label slot=label optional>Set the wild pokémon that defeated <b>{pokemon}</b></Label>
      </EncounterForm>
    {:else if ctx?.tab === 'trainer'}
      <TrainerForm bind:result>
        <Label slot=label optional>Set the trainer and pokémon that defeated <b>{pokemon}</b></Label>
      </TrainerForm>
    {:else if ctx?.tab === 'boss'}
      <BossForm bind:result>
        <Label slot=label optional>Set the boss, pokémon, and move that defeated <b>{pokemon}</b></Label>
      </BossForm>
    {/if}

    <div class='mt-2 w-full text-center flex flex-col md:flex-row md:inline-flex gap-2 md:gap-2'>
      <Button tabIndex=-1 rounded className='flex-1'>
        {EButton.Skip}
      </Button>
      <Button tabIndex=1 rounded solid className='flex-1'>
        {EButton.Submit}
      </Button>
    </div>

  </form>

<style>
  mark {
    @apply px-2 py-1 rounded-full text-gray-200 bg-gray-700;
  }
</style>
