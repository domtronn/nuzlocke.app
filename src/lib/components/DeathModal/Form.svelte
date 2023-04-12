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
    const subText = e?.submitter?.textContent
      || document?.activeElement?.textContent

    if (subText == EButton.Skip) dispatch('skip', ctx)
    if (subText == EButton.Submit) dispatch('submit', ctx)
  }

  export let pokemon, formData

  const toSpreadable = (o, key) => isEmpty(nonnull(o)) ? {} : { [key]: nonnull(o) }

  $: formData = nonnull({
    type: ctx?.tab,
    ...(toSpreadable({ from: ctx?.fromlvl, to: ctx?.tolvl }, 'lvl')),
    ...(toSpreadable(result?.pokemon, 'opponent')),
    ...(toSpreadable(result?.location, 'location')),
    ...(toSpreadable(result?.trainer, 'trainer')),
    ...(toSpreadable(result?.attack, 'attack')),
  })

  $: tabid = tabs.findIndex(tab => tab.val === ctx.tab)
</script>

<form class='flex flex-col gap-2 mt-8 md:mt-4 w-full text-left {$$restProps.class || ''}' on:submit={onsubmit}>
  <Label class='hidden md:block'>Set the encounter type</Label>
  <Tabs className='-my-2 md:my-0' labelClassName='text-sm' name='mech' bind:selected={ctx.tab} {tabs} />

  <div class='hpx bg-gray-500 w-full' />

    <Common
      bind:from={ctx.fromlvl}
      bind:to={ctx.tolvl}
    >
      <Label slot=label optional>Capture and defeat <span class='hidden md:inline'> level of <b>{pokemon}</b></span></Label>
    </Common>

    {#if ctx?.tab === 'encounter'}
      <EncounterForm bind:result>
        <Label slot=label optional>Wild pokémon <span class='hidden md:inline'> that defeated <b>{pokemon}</b></span></Label>
      </EncounterForm>
    {:else if ctx?.tab === 'trainer'}
      <TrainerForm bind:result>
        <Label slot=label optional>Opponnt trainer and pokémon <span class='hidden md:inline'> that defeated <b>{pokemon}</b></span></Label>
      </TrainerForm>
    {:else if ctx?.tab === 'boss'}
      <BossForm bind:result>
        <Label slot=label optional>Opponent, pokémon, and move <span class='hidden md:inline'> that defeated <b>{pokemon}</b></span></Label>
      </BossForm>
    {/if}

    <div class='buttons mt-2 w-full text-center flex flex-row md:inline-flex gap-2 md:gap-2'>
      <Button tabIndex=2 rounded className='flex-1'>
        {EButton.Skip}
      </Button>
      <Button tabIndex=1 rounded solid className='flex-1'>
        {EButton.Submit}
      </Button>
    </div>

  </form>

<style>
  form:global(.edit-mode > *) {
    display: none;
  }

  form:global(.edit-mode > .buttons) {
    display: flex;
    @apply w-full -mt-4;
  }
</style>
