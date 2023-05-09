<script>
  import MenuItem from './ContextMenuItem.svelte'
  import { Wrapper as SettingsWrapper } from '$c/Settings'
  import { Popover, PIcon, Icon } from '$c/core'
  import { NuzlockeGroups } from '$lib/data/states'
  import {
    Dots,
    Map,
    Add,
    Hide,
    Bin,
    Delete,
    Ball,
    Plus,
    Minus,
    External,
    Deceased
  } from '$icons'

  import { fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'

  export const Types = {
    Custom: 'custom',
    Starter: 'starter'
  }

  export const Events = {
    New: 'loc-new',
    Hide: 'loc-hide',
    Delete: 'loc-delete',
    Kill: 'mon-kill',
    Clear: 'clear',
    Evolve: 'mon-evolve',
    Capture: 'mon-capture',
    AddTeam: 'team-add',
    RemoveTeam: 'team-rem'
  }

  const dispatch = createEventDispatcher()
  const createDispatch = (id) => () => dispatch(id)

  export let title
  export let type = '',
    infolink,
    pokemon = null,
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
</script>

<Popover
  title="Open contextual menu"
  className="absolute top-16 mt-0.5 right-1 sm:top-0 sm:relative"
>
  <Icon inline height="1.4em" icon={Dots} class="fill-current" />

  <ul
    in:fly={{ duration: 250, x: 50 }}
    class="popover flex w-44 flex-col divide-y overflow-hidden rounded-xl bg-white pt-2 shadow-lg dark:divide-gray-600 dark:bg-gray-900"
    slot="popover"
  >
    <strong class="inline-flex w-full items-center justify-between px-4 pb-2">
      {title}
      <Icon inline={true} icon={Map} class="fill-current" />
    </strong>

    <MenuItem icon={Add} on:click={createDispatch(Events.New)}>
      Add Location
    </MenuItem>

    {#if type === Types.Custom}
      <MenuItem icon={Bin} on:click={createDispatch(Events.Delete)}>
        Delete Location
      </MenuItem>
    {/if}

    {#if type !== Types.Custom && type !== Types.Starter}
      <MenuItem icon={Hide} on:click={createDispatch(Events.Hide)}>
        Hide Location
      </MenuItem>
    {/if}

    {#if pokemon}
      <!-- Capture -->
      {#if showCapture}
        <MenuItem on:click={createDispatch(Events.Capture)}>
          <PIcon
            className="transform scale-75 -mx-2 -mr-0.5 -mt-2 -mb-1 grayscale"
            slot="icon"
            type="item"
            name="poke-ball"
          />
          Capture {pokemon?.name}
        </MenuItem>
      {/if}

      <!-- Evolve -->
      {#if showEvolve}
        <MenuItem on:click={createDispatch(Events.Evolve)}>
          <PIcon
            className="transform scale-75 -mx-2 -mr-0.5 -mt-2 -mb-1 grayscale"
            slot="icon"
            type="item"
            name="dawn-stone"
          />
          Evolve {pokemon?.name}
        </MenuItem>
      {/if}

      <!-- Kill -->
      {#if showKill}
        <MenuItem icon={Deceased} on:click={createDispatch(Events.Kill)}>
          Kill {pokemon?.name}
        </MenuItem>
      {/if}

      <!-- Add to team -->
      {#if showTeam}
        <MenuItem
          on:click={createDispatch(inteam ? Events.RemoveTeam : Events.AddTeam)}
        >
          <span slot="icon" class="relative mr-2 inline-flex translate-y-0.5">
            <Icon inline icon={Ball} class="scale-125 transform" />
            <Icon
              class="absolute -right-1.5 -top-1 scale-75 transform rounded-full bg-white dark:bg-gray-900"
              inline
              icon={inteam ? Minus : Plus}
            />
          </span>
          {inteam ? 'Remove from team' : 'Add to team'}
        </MenuItem>
      {/if}
    {/if}

    <SettingsWrapper id="permadeath" on="1" condition={+pokemon?.status === 5}>
      <svelte:fragment slot="else">
        <MenuItem icon={Delete} on:click={createDispatch(Events.Clear)}>
          Clear Encounter
        </MenuItem>
      </svelte:fragment>
    </SettingsWrapper>

    {#if infolink}
      <a
        href={infolink}
        title="Pokémon DB Link for {title}"
        rel="noreferrer"
        target="_blank"
      >
        <MenuItem el="div" icon={External}>Route Info</MenuItem>
      </a>
    {/if}
  </ul>
</Popover>
