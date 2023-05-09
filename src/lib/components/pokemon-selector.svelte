<script>
  export let location,
    locationName = '',
    type = '',
    infolink = ''

  import { fly } from 'svelte/transition'
  import { Natures } from '$lib/data/natures'
  import { NuzlockeStates, NuzlockeGroups } from '$lib/data/states'
  import { IconButton, AutoComplete, Input } from '$lib/components/core'
  import { Wrapper as SettingsWrapper } from '$lib/components/Settings'

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

  import { onMount, getContext } from 'svelte'

  let selected, nickname, status, nature, hidden

  // Search text bindings for ACs
  let search, statusSearch, natureSearch

  export let encounters = []
  let encounterItems = []

  let Particles, EvoModal, DeathModal
  onMount(() => {
    getPkmns(encounters).then(
      (e) =>
        (encounterItems = (encounters || [])
          .map((id) => e[id])
          .filter((i) => i))
    )

    import('$lib/components/particles').then((m) => (Particles = m.default))
    import('$lib/components/EvolutionModal.svelte').then(
      (m) => (EvoModal = m.default)
    )
    import('$lib/components/DeathModal/index.svelte').then(
      (m) => (DeathModal = m.default)
    )
  })

  const { getAllPkmn, getPkmns } = getContext('game')

  let dupelines = new Set(),
    misslines = new Set()

  let team,
    inteam,
    statusComplete = false

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
            <AutoComplete
              inset={selected ? true : '2.4em'}
              rounded
              fetch={search || !suggest ? getAllPkmn : null}
              items={search || !suggest ? [] : encounterItems}
              max={search || !suggest ? 16 : encounterItems.length}
              bind:search
              bind:selected
              name="{location} Encounter"
              placeholder="Find encounter"
              className="col-span-2 w-11/12 sm:w-full"
            >
              <span
                class="flex h-8 items-center px-4 py-5 md:py-6"
                class:hidden={dupes === 2 &&
                  (missdupes ? misslines : dupelines).has(item?.evoline)}
                class:dupe={dupes === 1 &&
                  (missdupes ? misslines : dupelines).has(item?.evoline)}
                aria-label={label}
                slot="item"
                let:item
                let:label
              >
                <PIcon
                  name={item?.sprite}
                  className="transform -mb-4 -ml-6 -mt-5 -mr-2"
                />
                {@html label}
                {#if dupes === 1 && (missdupes ? misslines : dupelines).has(item?.evoline)}
                  <span class="dupe__span absolute right-4 text-tiny">dupe</span
                  >
                {/if}
              </span>

              {selected}

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
            </AutoComplete>
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
        <AutoComplete
          wide
          rounded
          items={Object.values(NuzlockeStates)}
          bind:search={statusSearch}
          bind:selected={status}
          name="{location} Status"
          placeholder="Status"
          label="state"
          inset={status ? '2rem' : null}
          className="{!selected || hidden
            ? 'hidden sm:block'
            : ''} {status?.id === 4
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

          <button
            class="flex inline-flex items-center gap-x-2 px-3 py-2 md:py-3"
            slot="item"
            let:item
            let:label
          >
            <Icon
              inline={true}
              icon={item.icon}
              class="transform fill-current md:scale-125"
            />
            {@html label}
          </button>
        </AutoComplete>
      </svelte:fragment>
    </SettingsWrapper>

    <AutoComplete
      wide
      rounded
      items={Natures}
      bind:search={natureSearch}
      bind:selected={nature}
      name="{location} Nature"
      placeholder="Nature"
      max={Natures.length}
      className="col-span-1 {!selected || status?.id === 4 || hidden
        ? 'hidden sm:block'
        : ''}"
      dropdownClass="-translate-x-1/2 -ml-1 sm:translate-x-0 sm:ml-0"
    >
      <div
        class="-mx-1 flex inline-flex w-full items-center justify-between px-5 py-2 md:px-3 md:py-3"
        slot="item"
        let:item
        let:label
      >
        <span>{@html label}</span>
        {#if item.value.length}
          <span
            class="-my-4 -mr-3 flex items-end gap-x-2 text-tiny sm:flex-col sm:gap-x-0 sm:gap-y-1"
          >
            <span
              class="inline-flex items-center justify-end text-orange-400 dark:text-orange-300"
            >
              {item.value[0]}
              <Icon inline={true} icon={Chevron} class="fill-current" />
            </span>
            <span
              class="inline-flex items-center text-blue-600 dark:text-blue-300"
            >
              {item.value[1]}
              <Icon
                inline={true}
                icon={Chevron}
                class="rotate-180 transform fill-current"
              />
            </span>
          </span>
        {/if}
      </div>
    </AutoComplete>

    <span class="inline-flex gap-x-2 text-left">
      {#if selected && status && status.id !== 4 && status.id !== 5}
        <IconButton
          rounded
          src={Deceased}
          title="Kill {selected.name}"
          track="kill"
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
            <button>
              <Icon inline={true} icon={Add} class="mr-2 fill-current" />
              Add Location
            </button>
          </li>

          <SettingsWrapper id="permadeath" on="1" condition={status?.id === 5}>
            <li slot="else">
              <button>
                <Icon inline={true} icon={Delete} class="mr-2 fill-current" />
                Clear Encounter
              </button>
            </li>
          </SettingsWrapper>

          {#if type === 'custom'}
            <li>
              <button>
                <Icon inline={true} icon={Bin} class="mr-2 fill-current" />
                Delete Location
              </button>
            </li>
          {/if}

          {#if type !== 'custom' && type !== 'starter'}
            <li>
              <button>
                <Icon inline={true} icon={Hide} class="mr-2 fill-current" />
                Hide Location
              </button>
            </li>
          {/if}

          {#if selected && !hidden && selected?.evos?.length && (!status || NuzlockeGroups.Available.includes(status.id))}
            <li>
              <button class="inline-flex">
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
              <button class="inline-flex">
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
