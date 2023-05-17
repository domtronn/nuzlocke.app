<script>
  import { IconButton, Icon } from '$c/core'
  import { Deceased, Ball, Plus, Minus } from '$icons'
  import { NuzlockeGroups } from '$lib/data/states'
  import { Events } from './events.ts'

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  const createDispatch = (id) => () => dispatch(id)

  export let pokemon,
    name,
    team = [],
    inteam = false

  // Predicates
  const available = (id) => NuzlockeGroups.Available.includes(id)
  const showCapture = !pokemon?.hidden && !pokemon?.status
  const showKill = !pokemon?.hidden && available(pokemon?.status)

  const showEvolve =
    !pokemon?.hidden && pokemon?.evos?.length && available(pokemon?.status)

  const showTeam =
    !pokemon?.hidden &&
    available(pokemon?.status) &&
    (inteam || team.length < 6)

  const addTitle = (inteam ? 'Remove' : 'Add') + ` ${name} from your team`
</script>

{#if pokemon}
  {#if showKill}
    <IconButton
      on:click={createDispatch(Events.Kill)}
      rounded
      src={Deceased}
      title="Kill {name}"
    />
  {/if}

  {#if showCapture}
    <IconButton
      on:click={createDispatch(Events.Capture)}
      rounded
      name="poke-ball"
      color="orange"
      title="Capture {name}"
    />
  {/if}

  {#if showEvolve}
    <IconButton
      on:click={createDispatch(Events.Evolve)}
      rounded
      name="dawn-stone"
      color="green"
      title="Evolve {name}"
    />
  {/if}

  {#if showTeam}
    <IconButton
      rounded
      src={Ball}
      title={addTitle}
      color="sky"
      containerClassName="relative"
      on:click={createDispatch(inteam ? Events.RemoveTeam : Events.AddTeam)}
    >
      <Icon
        inline
        icon={inteam ? Minus : Plus}
        class="absolute right-0.5 top-0.5 scale-75 transform rounded-full bg-white dark:bg-gray-800"
      />
    </IconButton>
  {/if}
{/if}
