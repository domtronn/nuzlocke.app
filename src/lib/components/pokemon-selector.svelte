<script>
  export let id,
    store,
    location,
    locationName = '',
    type = '',
    infolink = ''

  import { read, readdata, patch, getTeams } from '$lib/store'
  import { capitalise } from '$lib/utils/string'

  import { fly } from 'svelte/transition'
  import { Natures, NaturesMap } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, Input } from '$lib/components/core'
  import { Wrapper as SettingsWrapper } from '$lib/components/Settings'

  import AutoCompleteV2 from '$c/core/AutoCompleteV2.svelte'
  import Popover from '$lib/components/core/Popover.svelte'

  import { PIcon, Icon } from '$c/core'
  import {
    Chevron,
    Add,
    Ball,
    Plus,
    Minus,
    Delete,
    Deceased,
    External,
    Bin,
    Hide,
    Dots,
    Map,
    Search,
    LongGrass
  } from '$icons'

  import { createEventDispatcher, onMount, getContext } from 'svelte'

  let selected, nickname, status, nature, hidden, death
  let prevstatus = 'loading'

  // Search text bindings for ACs
  let search, statusSearch, natureSearch

  export let encounters = []
  let encounterItems = []
  const encounterF = (_) =>
    getPkmns(encounters).then((e) =>
      (encounters || []).map((id) => e[id]).filter((i) => i)
    )

  let Particles, EvoModal, DeathModal
  onMount(() => {
    const [data] = readdata()
    const loc = data[location]
    if (typeof loc?.pokemon !== 'undefined') {
      const o = {
        ...loc,
        alias: loc.pokemon,
        sprite: loc.pokemon,
        label: capitalise(loc.pokemon)
      }
      selected = o
    }

    import('$lib/components/particles').then((m) => (Particles = m.default))
    import('$lib/components/EvolutionModal.svelte').then(
      (m) => (EvoModal = m.default)
    )
    import('$lib/components/DeathModal/index.svelte').then(
      (m) => (DeathModal = m.default)
    )
    prevstatus = null
  })

  const { getAllPkmn, getPkmn, getPkmns } = getContext('game')
  const dispatch = createEventDispatcher()

  let loading = true
  let dupelines = new Set(),
    misslines = new Set()

  let team, inteam

  getTeams((t) => (team = t.team))

  let resetd, hiddenLength
  store &&
    store.subscribe(
      read((data) => {
        hiddenLength = data?.__hidden?.length

        const getStateMons = (data, stateGroup) => {
          return Object.values(data)
            .filter((p) => p && (!p.status || stateGroup.includes(p?.status)))
            .map((p) => p.pokemon)
            .filter((i) => i)
        }

        getPkmns(getStateMons(data, NuzlockeGroups.Dupes)).then(
          (p) => (dupelines = new Set(Object.values(p).map((p) => p?.evoline)))
        )
        getPkmns(getStateMons(data, NuzlockeGroups.MissDupes)).then(
          (p) => (misslines = new Set(Object.values(p).map((p) => p?.evoline)))
        )

        if (!!resetd && !data[location]) {
          handleClear()
          return
        }

        const pkmn = data[location]
        if (!pkmn) return

        resetd = pkmn

        status = pkmn.status ? NuzlockeStates[pkmn.status] : null
        nature = pkmn.nature ? NaturesMap[pkmn.nature] : null
        hidden = pkmn.hidden
        nickname = pkmn.nickname
        death = pkmn.death
        if (pkmn.pokemon)
          getPkmn(pkmn.pokemon).then((p) => {
            selected = p
            loading = false
          })
      })
    )

  $: {
    if (selected)
      store.update(
        patch({
          [location]: {
            id,
            pokemon: selected?.alias,
            status: status?.id,
            nature: nature?.id,
            location: locationName || location,
            ...(nickname ? { nickname } : {}),
            ...(hidden ? { hidden: true } : {}),
            ...(status?.id === 5 && death ? { death } : {})
          }
        })
      )

    // TODO: Handle death state team clearin
    inteam = (team || []).includes(location)
  }

  const onhide = () => {
    if (
      !hiddenLength &&
      !window.confirm(
        `Hiding a location will delete all encounter data for this location and prevent it from appearing in this run.\n\nYou can reset hidden locations from "Settings".\n\nAre you sure you want to hide ${location}?`
      )
    )
      return

    handleClear()
    dispatch('hide', { id: location })
  }

  const onnew = () => dispatch('new', { id })
  const ondelete = () => {
    if (
      selected &&
      !confirm(
        `You are about to delete a custom location - this will also delete your Pokémon, ${selected.name}. Are you sure you wish to continue?`
      )
    )
      return

    handleClear()
    dispatch('delete', { id: location })
  }

  function setTeam(team) {
    store.update(patch({ __team: team.slice(0, 6) }))
  }

  /** Team management */
  function handleTeamAdd() {
    setTeam((team || []).filter((i) => i !== location).concat(location))
  }

  function handleTeamRemove() {
    setTeam((team || []).filter((i) => i !== location))
  }

  function handleClear() {
    status = nickname = selected = death = resetd = null
    search = statusSearch = natureSearch = null
    store.update(
      patch({
        [location]: {},
        __team: team.filter((i) => i !== location).slice(0, 6)
      })
    )
  }

  let statusComplete = false
  const handleStatus = (sid) => () => {
    const cb = (data) => {
      if (sid === 5) {
        handleTeamRemove()
        death = data
      }

      status = NuzlockeStates[sid]
      _animateStatus(sid)
    }

    if (sid === 5) return handleDeath(cb)
    else cb()
  }

  const _animateStatus = (sid) => {
    if (sid === 2 || sid === 3) statusComplete = ['parcel', 'profs-letter']
    if (sid === 1)
      statusComplete = ['poke-ball', 'friend-ball', 'heavy-ball', 'master-ball']
    if (sid === 5)
      statusComplete = [
        'thick-club',
        'quick-claw',
        'rare-bone',
        'dragon-fang',
        'sharp-beak'
      ]
    if (sid === 6)
      statusComplete = [
        'health-av-candy',
        'tapunium-z--held',
        'revive',
        'electric-gem',
        'max-revive'
      ]
    if (sid === 100)
      statusComplete = ['revival-herb', 'revival-herb', 'starf-berry']
    if (sid === 200)
      statusComplete = ['thunder-stone', 'fire-stone', 'water-stone']
  }

  const { open } = getContext('simple-modal')
  let evoComplete = false
  const handleSplitEvolution = (base, evolutions) =>
    open(EvoModal, { evolutions, base, select: handleSingleEvolution })
  const handleSingleEvolution = async (id) =>
    getPkmn(id).then((p) => {
      selected = p
      evoComplete = true
      _animateStatus(200)
    })

  const handleEvolution = (base, evos) => async () =>
    handleSplitEvolution(base, evos)
  const handleDeath = (submit) =>
    open(DeathModal, { submit, pokemon: selected, nickname })

  const handleReveal = () => {
    hidden = false
    _animateStatus(100)
  }

  $: gray = NuzlockeGroups.Unavailable.includes(status?.id)
</script>

<SettingsWrapper id="nickname-clause" let:setting={nicknames}>
  <div
    class:lg:grid-cols-8={nicknames}
    class:lg:grid-cols-6={!nicknames}
    class="relative flex grid w-full grid-cols-2 gap-y-3 gap-x-2 md:grid-cols-4 md:gap-y-2 lg:grid-cols-8 lg:gap-y-0"
  >
    <span class="location group relative z-50">
      {#if $$slots.location}
        <slot name="location" />
      {:else}
        {location}
      {/if}
    </span>

    <SettingsWrapper id="encounter-suggestions" let:setting={suggest}>
      <SettingsWrapper id="dupe-clause" let:setting={dupes}>
        <SettingsWrapper id="missed-dupes" let:setting={missdupes}>
          {#if selected && (selected.hidden || hidden)}
            <button
              class="group relative col-span-2 m-0 inline-flex w-11/12 items-center justify-between overflow-hidden rounded-lg border-2 pr-3 transition-colors hover:border-lime-500 dark:border-gray-600 dark:bg-transparent dark:hover:border-lime-400 dark:hover:bg-gray-700/25 sm:w-full sm:text-xs"
              on:click={handleReveal}
            >
              <div
                class="inline-flex items-center opacity-50 blur grayscale dark:opacity-100"
              >
                <PIcon
                  className="-my-2 sm:-my-3 -mx-2"
                  name={selected.sprite}
                />
                <span>{selected.name}</span>
              </div>
              <span
                class="tracking-wide text-gray-400 group-hover:text-lime-500 dark:text-gray-200 dark:group-hover:text-lime-400"
                >Reveal</span
              >
              <Icon
                icon={LongGrass}
                height="1.4rem"
                class="absolute left-0.5 -bottom-1.5 text-gray-200 transition-colors group-hover:animate-shake group-hover:text-lime-400 dark:text-gray-700 dark:group-hover:text-lime-500 max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500"
              />
              <Icon
                icon={LongGrass}
                height="1.4rem"
                class="absolute left-7 -bottom-1.5 text-gray-200 transition-colors group-hover:animate-shake group-hover:text-lime-400 dark:text-gray-700 dark:group-hover:text-lime-500 max-sm:animate-shake max-sm:text-lime-400 dark:max-sm:text-lime-500"
              />
              <Icon
                icon={LongGrass}
                height="2.5rem"
                class="absolute left-1.5 -bottom-3 text-gray-300 transition-colors group-hover:animate-shake group-hover:text-lime-500 dark:text-gray-600 dark:group-hover:text-lime-400 max-sm:animate-shake max-sm:text-lime-500 dark:max-sm:text-lime-400"
              />
            </button>
          {:else}
            {@const fetchSearch = (search && search !== selected) || !suggest}

            <AutoCompleteV2
              inset={selected ? true : '2.4em'}
              itemF={(_) => (fetchSearch ? getAllPkmn() : encounterF())}
              max={fetchSearch ? 16 : encounters.length}
              bind:search
              bind:selected
              name="{location} Encounter"
              placeholder="Find encounter"
              class="col-span-2 w-11/12 sm:w-full"
            >
              <span
                class="flex h-8 items-center px-4 py-5 md:py-6"
                class:hidden={dupes === 2 &&
                  (missdupes ? misslines : dupelines).has(option?.evoline)}
                class:dupe={dupes === 1 &&
                  (missdupes ? misslines : dupelines).has(option?.evoline)}
                aria-label={label}
                slot="option"
                let:option
                let:label
              >
                <PIcon
                  name={option?.sprite}
                  className="transform -mb-4 -ml-6 -mt-5 -mr-2"
                />
                {@html label}
                {#if dupes === 1 && (missdupes ? misslines : dupelines).has(option?.evoline)}
                  <span class="dupe__span absolute right-4 text-tiny">dupe</span
                  >
                {/if}
              </span>

              <svelte:fragment slot="icon" let:iconClass>
                {#if selected}
                  <div class="absolute left-4 top-2 z-50">
                    {#if statusComplete}
                      <Particles
                        amount={Math.round(Math.random() * 4) +
                          Math.pow(statusComplete.length, 2)}
                        icons={statusComplete}
                        on:end={() => (statusComplete = false)}
                      />
                    {/if}
                  </div>

                  <PIcon
                    name={selected.sprite}
                    className="{gray ? 'grayscale' : ''} {iconClass}"
                  />
                {:else}
                  <Icon
                    inline={true}
                    height="0.7em"
                    icon={Search}
                    class="left-3 fill-current text-gray-500 {iconClass}"
                  />
                {/if}
              </svelte:fragment>
            </AutoCompleteV2>
          {/if}
        </SettingsWrapper>
      </SettingsWrapper>
    </SettingsWrapper>

    <SettingsWrapper id="nickname-clause" on="1">
      <Input
        rounded
        bind:value={nickname}
        name="{location} Nickname"
        placeholder="Nickname"
        className="col-span-2 {!selected || hidden || status?.id === 4
          ? 'hidden sm:block'
          : ''}"
      />
    </SettingsWrapper>

    <SettingsWrapper id="permadeath" on="1" condition={status?.id === 5}>
      <div
        class="flex h-10 cursor-not-allowed items-center rounded-lg border-2 text-sm text-gray-800 shadow-sm dark:border-gray-600 dark:text-gray-200"
      >
        <Icon
          inline={true}
          class="mx-2 fill-current"
          icon={NuzlockeStates[5].icon}
        />
        Dead
      </div>

      <svelte:fragment slot="else">
        <AutoCompleteV2
          itemF={(_) => Object.values(NuzlockeStates)}
          labelF={(_) => _.state}
          inset={status ? '2rem' : null}
          bind:search={statusSearch}
          bind:selected={status}
          name="{location} Status"
          placeholder="Status"
          class="{!selected || hidden ? 'hidden sm:block' : ''} {status?.id ===
          4
            ? 'col-span-2 sm:col-span-1'
            : 'col-span-1'}"
        >
          <svelte:fragment slot="icon" let:iconClass let:selected>
            {#if selected}
              <Icon
                inline={true}
                class="{iconClass} left-3 fill-current"
                icon={selected.icon}
              />
            {/if}
          </svelte:fragment>

          <div
            on:click={handleStatus(option.id)}
            class="flex inline-flex items-center gap-x-2 px-3 py-2 md:py-3"
            slot="option"
            let:option
            let:label
          >
            <Icon
              inline={true}
              icon={option.icon}
              class="transform fill-current md:scale-125"
            />
            {@html label}
          </div>
        </AutoCompleteV2>
      </svelte:fragment>
    </SettingsWrapper>

    <AutoCompleteV2
      itemF={(_) => Natures}
      max={Natures.length}
      bind:search={natureSearch}
      bind:selected={nature}
      name="{location} Nature"
      placeholder="Nature"
      class="col-span-1 {!selected || status?.id === 4 || hidden
        ? 'hidden sm:block'
        : ''}"
    >
      <div
        class="-mx-1 flex inline-flex w-full items-center justify-between px-5 py-2 md:px-3 md:py-3"
        slot="option"
        let:option
        let:label
      >
        <span>{@html label}</span>
        {#if option.value.length}
          <span
            class="-my-4 -mr-3 flex items-end gap-x-2 text-tiny sm:flex-col sm:gap-x-0 sm:gap-y-1"
          >
            <span
              class="inline-flex items-center justify-end text-orange-400 dark:text-orange-300"
            >
              {option.value[0]}
              <Icon inline={true} icon={Chevron} class="fill-current" />
            </span>
            <span
              class="inline-flex items-center text-blue-600 dark:text-blue-300"
            >
              {option.value[1]}
              <Icon
                inline={true}
                icon={Chevron}
                class="rotate-180 transform fill-current"
              />
            </span>
          </span>
        {/if}
      </div>
    </AutoCompleteV2>

    <span class="inline-flex gap-x-2 text-left">
      {#if selected && status && status.id !== 4 && status.id !== 5}
        <IconButton
          rounded
          src={Deceased}
          title="Kill {selected.name}"
          track="kill"
          on:click={handleStatus(5)}
          containerClassName={!selected || hidden ? 'hidden sm:block' : ''}
        />
      {/if}

      {#if selected && !hidden && !status}
        <IconButton
          rounded
          name="poke-ball"
          color="orange"
          className="-translate-y-0.5"
          containerClassName={!selected ? 'hidden sm:block' : ''}
          on:click={handleStatus(1)}
          title="Capture {selected.name}"
        />
      {/if}

      {#if selected && !hidden && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
        <IconButton
          rounded
          name="dawn-stone"
          className="-translate-y-0.5"
          containerClassName={!selected ? 'hidden sm:block' : ''}
          color="green"
          title="Evolve {selected.name}"
          on:click={handleEvolution(selected.sprite, selected.evos)}
        />
      {/if}

      {#if selected && !hidden && (inteam || team.length < 6) && status && NuzlockeGroups.Available.includes(status.id)}
        <IconButton
          rounded
          src={Ball}
          className="transform scale-125"
          containerClassName="relative"
          color="sky"
          title="{inteam ? `Remove` : `Add`} {selected.name} {inteam
            ? `from`
            : `to`} your team"
          on:click={inteam ? handleTeamRemove : handleTeamAdd}
        >
          <Icon
            class="absolute right-0.5 top-0.5 scale-75 transform rounded-full bg-white dark:bg-gray-800"
            inline
            icon={inteam ? Minus : Plus}
          />
        </IconButton>
      {/if}

      <Popover
        title="Open contextual menu"
        className="absolute top-16 mt-0.5 right-1 sm:top-0 sm:relative "
      >
        <Icon inline={true} height="1.4em" icon={Dots} class="fill-current" />

        <ul
          in:fly={{ duration: 250, x: 50 }}
          class="popover flex w-44 flex-col divide-y rounded-xl bg-white pt-2 shadow-lg dark:divide-gray-600 dark:bg-gray-900"
          slot="popover"
        >
          <strong
            class="inline-flex w-full items-center justify-between px-4 pb-2"
          >
            {locationName || location}
            <Icon inline={true} icon={Map} class="fill-current" />
          </strong>

          <li>
            <button on:click={onnew}>
              <Icon inline={true} icon={Add} class="mr-2 fill-current" />
              Add Location
            </button>
          </li>

          <SettingsWrapper id="permadeath" on="1" condition={status?.id === 5}>
            <li slot="else">
              <button on:click={handleClear}>
                <Icon inline={true} icon={Delete} class="mr-2 fill-current" />
                Clear Encounter
              </button>
            </li>
          </SettingsWrapper>

          {#if type === 'custom'}
            <li>
              <button on:click={ondelete}>
                <Icon inline={true} icon={Bin} class="mr-2 fill-current" />
                Delete Location
              </button>
            </li>
          {/if}

          {#if type !== 'custom' && type !== 'starter'}
            <li>
              <button on:click={onhide}>
                <Icon inline={true} icon={Hide} class="mr-2 fill-current" />
                Hide Location
              </button>
            </li>
          {/if}

          {#if selected && !hidden && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
            <li>
              <button
                class="inline-flex"
                on:click={handleEvolution(selected.sprite, selected.evos)}
              >
                <PIcon
                  className="transform scale-75 -mr-2 -ml-1.5 -my-1 grayscale"
                  type="item"
                  name="dawn-stone"
                />
                <span class="ml-0.5">Evolve {nickname || selected.name}</span>
              </button>
            </li>
          {/if}

          {#if selected && !hidden && !status}
            <li>
              <button class="inline-flex" on:click={handleStatus(1)}>
                <PIcon
                  className="transform scale-75 -mr-2 -ml-1.5 -my-1 grayscale"
                  type="item"
                  name="poke-ball"
                />
                Capture {selected.name}
              </button>
            </li>
          {/if}

          {#if selected && !hidden && (inteam || team.length < 6) && status && NuzlockeGroups.Available.includes(status.id)}
            <li>
              <button
                class="inline-flex"
                title="{inteam ? `Remove` : `Add`} {selected.name} {inteam
                  ? `from`
                  : `to`} your team"
                on:click={inteam ? handleTeamRemove : handleTeamAdd}
              >
                <span class="relative mr-2">
                  <Icon inline icon={Ball} class="scale-125 transform" />
                  <Icon
                    class="group-bg absolute -right-1.5 -top-1 scale-75 transform rounded-full bg-white dark:bg-gray-900"
                    inline
                    icon={inteam ? Minus : Plus}
                  />
                </span>
                {inteam ? `Remove from Team` : `Add to Team`}
              </button>
            </li>
          {/if}

          {#if infolink}
            <li>
              <a
                href={infolink}
                title="Pokémon DB Link for {location}"
                rel="noreferrer"
                target="_blank"
              >
                <Icon
                  inline={true}
                  icon={External}
                  class="-mt-0.5 mr-2 inline fill-current"
                />
                Route Info
              </a>
            </li>
          {/if}
        </ul>
      </Popover>
    </span>
  </div>
</SettingsWrapper>

<style lang="postcss">
  .dupe {
    @apply mr-2 text-tiny opacity-25 grayscale;
  }

  .location {
    @apply col-span-2 mr-4 mt-4 flex h-full items-center text-lg font-medium sm:col-span-1 sm:mt-0 sm:text-sm sm:font-normal md:col-span-4 lg:col-span-1 lg:justify-end lg:text-right;
  }

  ul.popover {
    @apply text-gray-800;
  }
  .popover button,
  .popover a {
    @apply w-full cursor-pointer px-4 py-2 text-left text-tiny transition;
  }
  .popover li:hover {
    @apply text-red-400;
  }
  .popover li:last-of-type {
    @apply rounded-b-xl;
  }
  .popover li,
  .popover li :global(*) {
    @apply inline-flex items-center;
  }

  :global(.dark) ul.popover {
    @apply text-gray-50;
  }
  :global(.dark) .popover li:hover {
    @apply bg-orange-500 text-white;
  }
  :global(.dark) .popover li:hover :global(.group-bg) {
    @apply bg-orange-500 text-white;
  }
</style>
