<script>
  import { onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import { Footer } from '$c/navs'

  import PokemonCard from '$lib/components/pokemon-card.svelte'
  import { MiniTeam } from '$lib/components/TeamBuilder'

  import { Loader, PIcon, IconButton, Tooltip, Toggle } from '$c/core'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Modal as AnalysisModal } from '$lib/components/Analysis'

  import { drag } from '$utils/drag'

  import { getBox, updatePokemon, killPokemon } from '$lib/store'
  import { canonTypes as types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import { CUSTOM, UNOWN, createImgUrl } from '$utils/rewrites'
  import { toDb } from '$utils/link'
  import deferStyles from '$utils/defer-styles'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Plus, Shiny, X, Deceased, External } from '$icons'

  const { getPkmns, getPkmn } = getContext('game')
  const { open } = getContext('simple-modal')

  let minimal = false
  let Particles, EvoModal, DeathModal
  onMount(() => {
    deferStyles('/assets/pokemon.css')
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)
    import('$lib/components/DeathModal/index.svelte').then(m => DeathModal = m.default)

    // FIXME: Awkward hack to allow page transition cleanup
    ;['game_el', 'sidenav_el'].forEach(id =>{
      const el = document.getElementById(id)
      if (el) {
        el.style = 'opacity: 0';
        setTimeout(_ => el.remove(), 500)
      }
    })
  })

  let loading = true
  let ogbox = [], box = [], Pokemon = {}
  getBox(b => {
    ogbox = box = b
    getPkmns(box.map(i => i.pokemon))
      .then(data => {
        Pokemon = data
        loading = false
      })
  })

  let type = ''
  let stat = ''

  const clear = () => stat = type = ''
  const sum = l => l.reduce((acc, it) => acc + it, 0)
  $: filter = (p) => !type || (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(type)

  $: typeCounts = types
  .reduce((acc, it) => ({
    ...acc,
    [it]: ogbox.filter(p => (Pokemon[p.pokemon]?.types || []).map(i => i.toLowerCase()).includes(it)).length
  }), {})

  $: box = [...ogbox]
  .sort((a, b) => {
    if (stat === 'total') {
      return sum(Object.values(Pokemon[b.pokemon]?.baseStats))
        - sum(Object.values(Pokemon[a.pokemon]?.baseStats))
    }

    if (stat === 'type') {
      const val = Pokemon[b.pokemon].types.join('/')
            .localeCompare(Pokemon[a.pokemon].types.join('/'))

      if (val !== 0) return val
      return sum(Object.values(Pokemon[b.pokemon]?.baseStats))
        - sum(Object.values(Pokemon[a.pokemon]?.baseStats))
    }

    return stat
      ? Pokemon[b.pokemon]?.baseStats[stat] - Pokemon[a.pokemon]?.baseStats[stat]
      : a.id - b.id
  })

  $: enabled = box.length && (stat || type)

  const toid = p => `${p.id}@${p.location}`

  let evoComplete = false
  const handleEvo = ({ evos, alias }, original) => open(EvoModal, { evolutions: evos, base: alias, select: handleEvoComplete(original) })
  const handleEvoComplete = o => async id => getPkmn(id)
        .then(p => {
          getPkmns(box.map(i => i.pokemon).concat(p.alias))
            .then(data => {
              Pokemon = data
              ogbox = ogbox.map(i => {
                return toid(i) == toid(o) ? { ...i, pokemon: p.alias } : i
              })

              updatePokemon({ ...o, pokemon: p.alias })
              evoComplete = toid(o)
            })
        })

  const handleKill = (o) => () => {
    open(DeathModal, {
      submit: handleDeath(o),
      pokemon: Pokemon[o.pokemon],
      nickname: o.nickname
    })
  }

  const handleDeath = o => death => {
    ogbox = ogbox.filter(i => toid(i) !== toid(o))
    killPokemon({ ...o, death })
  }

  let team = [], mons
  function teamhas (mon) {
    return !!team.find(t => t.id === mon.id)
  }

  function teamadd (evt) {
    if (team.map(t => t.id).includes(evt.detail.data.id)) return
    team = team.concat(evt.detail.data)
  }

  function teamreplace (evt) {
    team = team.map((it, i) => i === evt.detail.targetId ? evt.detail.data : it)
  }
  function teamremove (mon, id) { team = team.filter((it, i) => it.id !== mon.detail.data.id)}

  function teamswap (evt) {
    const targetId = Math.min(evt.detail.targetId, team.length - 1)
    const srcId = evt.detail.srcId

    team = team.map((it, i, arr) => {
      if (i === targetId) return arr[srcId]
      if (i === srcId) return arr[targetId]
      return it
    })
  }

  $: mons = team.map(t => ogbox.find(o => t.id == o.id))

</script>
{#if loading}
  <Loader />
{:else}
  <div out:fade|local={{ duration: 250 }} in:fade|local={{ duration: 250, delay: 300 }} class='container mx-auto'>
    <div class='flex flex-col mx-auto items-center justify-center'>
      <main class='w-full xl:w-3/4 flex flex-col gap-y-4 py-6 pb-48 px-4 md:px-8 overflow-hidden snap-y scroll-pt-5'>

        <div class='flex flex-col md:flex-row items-end md:items-center gap-x-2 relative md:mt-0 sm:-my-2 snap-start'>
          <AnalysisModal box={Object.values(Pokemon)}>
            Box
          </AnalysisModal>
          <AnalysisModal box={team.map(p => Pokemon[p.pokemon])}>
            Team
          </AnalysisModal>
          <div class='mt-1 flex md:flex-row-reverse gap-x-2'>
            <Toggle id=minimal bind:state={minimal}>
              <small>Hide stats</small>
            </Toggle>
          </div>
        </div>

        <div class='inline-flex flex-wrap md:flex-nowrap sm:flex-row gap-y-2 gap-x-4 sm:items-start z-50 mt-2'>
          <div class='grid sm:grid-rows-2 grid-cols-8 w-full sm:w-auto sm:grid-cols-5 gap-1 sm:gap-2 col-span-2'>
            <IconButton
              rounded
              src={X}
              title='Clear filters'
              containerClassName='flex flex-col order-last sm:row-span-2 sm:order-none items-center justify-center relative'
              disabled={!enabled}
              on:click={clear}
              >
              <Tooltip>Clear all filters</Tooltip>
            </IconButton>

            {#each stats as s}
              <label
                class='transition items-center shadow-sm cursor-pointer inline-flex text-center row-span-1 text-xs px-2 py-1 w-full text-gray-500 dark:text-gray-400 border-gray-400 font-medium border shadow-sm rounded-lg justify-center md:justify-between'
                class:border-gray-600={stat === s}
                class:text-gray-50={stat === s}
                class:bg-gray-600={stat === s}
                class:dark:bg-gray-50={stat === s}
                class:dark:text-gray-900={stat === s}
                class:dark:border-gray-50={stat === s}
                >
                <input type=radio bind:group={stat} name='sortable' value={s} />
                {#if StatIconMap[s]}
                  <Icon inline={true} class='hidden md:block text-tiny {s !== 'spa' ? 'fill-current' : ''} translate-y-1/2 -mt-2.5 mr-1'  icon={StatIconMap[s]} />
                {:else}
                  <span />
                {/if}
                {s}
              </label>
            {/each}
          </div>

          <div class='sm:w-auto grid grid-cols-6 md:grid-cols-6 gap-x-2 gap-y-2 col-span-3'>
            {#each types as t}
              {#if typeCounts[t] > 0}
                <label
                  class='transition cursor-pointer h-6'
                  class:grayscale={(type && type !== t) || !typeCounts[t]}
                  class:opacity-50={(type && type !== t) || !typeCounts[t]}
                  class:grayscale-0={type && type === t}
                  >
                  <input disabled={!typeCounts[t]} type=radio bind:group={type} name='filter' value={t} />
                  <TypeBadge type={t} className='w-full justify-center' />
                </label>
              {/if}
            {/each}
          </div>


          <div class='max-md:fixed max-md:pb-2 max-md:pt-4 max-md:border-t-2 dark:border-gray-900 border-gray-200 w-full md:w-auto mx-auto bottom-0 left-0 backdrop-blur-xl text-center md:text-right md:-translate-y-12'>
            <h2 class='max-md:hidden font-bold -mb-1 text-gray-800 dark:text-gray-200'>Your team</h2>
            <p class='max-md:hidden font-italic text-gray-600 dark:text-gray-400'>
              <small>Drag pokemon from your box to the slots</small>
            </p>
            <MiniTeam
              {mons}
              class='-mr-2.5'
              iconKey=pokemon

              on:add={teamadd}
              on:remove={teamremove}
              on:replace={teamreplace}
              on:swap={teamswap}
              />
          </div>
        </div>

        <div
          class:grid-cols-1={!minimal}
          class:grid-cols-2={minimal}
          class:sm:grid-cols-2={!minimal}
          class:sm:grid-cols-3={minimal}
          class:md:grid-cols-4={minimal}
          class:lg:grid-cols-3={!minimal}
          class:lg:grid-cols-5={minimal}
          class:xl:grid-cols-4={!minimal}
          class:xl:grid-cols-5={minimal}
          class='grid gap-x-4 gap-y-8 mt-6'
          >
          {#if box.length === 0}
            <span class='h-96 flex items-center justify-center col-span-4 dark:text-gray-600 text-xl'>You have no Pokémon in your box</span>
          {/if}
          {#each box.filter(filter) as p (p)}
            <span
              use:drag={{ data: p, effect: 'copy', hideImg: true }}
              class='snap-start'
              animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
              out:fade={{ duration: 150 }}
              >

              <PIcon class='absolute invisible -z-20 -left-20 -bottom-20 data-drag-img' name={p.pokemon} />

              <PokemonCard
                {minimal}
                sprite={createImgUrl(Pokemon[p.pokemon], { shiny: p.status === 6, ext: 'png' })}
                fallback={UNOWN}
                maxStat={Math.max(150, ...Object.values(Pokemon[p.pokemon].baseStats))}
                moves={[]}
                ability={p.nickname ? { name: p.nickname + ' the ' + (p.nature || '').toLowerCase() } : null}
                name={Pokemon[p.pokemon].name}
                stats={Pokemon[p.pokemon].baseStats}
                nature={p.nature}
                types={(Pokemon[p.pokemon].types || []).map(t => t.toLowerCase())}
                >

                <span slot=img>
                  {#if evoComplete === toid(p)}
                    <span style='z-index: 999999' class='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
                      <Particles
                        amount={25}
                        icons={['ice-stone', 'dawn-stone', 'fire-stone']}
                        on:end={() => evoComplete = false}
                        />
                    </span>
                  {/if}
                  {#if p.status === 6}
                    <Icon inline={true} icon={Shiny} height=3.6em class='fill-current absolute animate-pulse z-50 text-orange-200 -translate-y-3/4 left-1/2 -translate-x-full' />
                    <Icon inline={true} icon={Shiny} height=2.8em class='fill-current absolute animate-pulse z-50 text-orange-300 top-0 transform rotate-180 right-0 translate-y-1/4 -translate-x-2/3' />
                  {/if}
                </span>


                <span class='text-xs text-center p-2 text-gray-500 z-40' slot=footer let:id>
                  {#if p.location === 'Starter'}
                    Met in a fateful encounter
                  {:else if !p.location}
                    Met in an unknown place
                  {:else if p.type !== 'custom'}
                    Met {p.location.startsWith('Route') ? 'on' : 'in'} {p.location}
                  {/if}

<span class=mx-1>ǀ</span>

<a class='hover:text-black dark:hover:text-gray-50 transition border-b border-transparent hover:border-black inline'
   href={toDb(id)}
   title='Pokémon DB Link for {id}'
   rel=noreferrer target=_blank >
  Info
  <Icon inline={true} icon={External} class='fill-current inline -mt-0.5' />
</a>

<div class:hidden={minimal} class='card-controls absolute -bottom-4 flex left-1/2 -translate-x-1/2 border border-gray-200 bg-red-200 rounded-lg shadow-md'>
  {#if Pokemon[p.pokemon].evos?.length}
    <IconButton
      className='translate-y-1 -mb-px transform scale-75'
      borderless
      name=dawn-stone
      on:click={handleEvo(Pokemon[p.pokemon], p)}
      />
    {/if}
    <IconButton
      on:click={handleKill(p)}
      className=translate-y-1
      src={Deceased}
      borderless
      />

    {#if team.length < 6 || team.find(t => t.id == p.id)}
      <IconButton
        className='transform scale-75'
        borderless
        on:click={(team.find(t=>t.id === p.id) ? teamremove : teamadd).bind({}, { detail: { data: p }})}
        >
        <!-- FIXME: What the fuck...  -->
        <span class='absolute transition-none dark:transition right-5 top-[10px] dark:text-gray-500 dark:group-hover:text-gray-400'>
          {#if team.find(t=>t.id === p.id)}
            -
          {:else}
            +
          {/if}
        </span>
        <PIcon class='-ml-4 -mr-5 -mt-4 -mb-6 opacity-30 transition dark:contrast-0 dark:opacity-80 group-hover:opacity-100 transform scale-50' name=unknown-pokemon2 />
      </IconButton>
    {/if}
  </div>

                </span>
              </PokemonCard>
            </span>
          {/each}
        </div>

        <Footer class='!relative !mt-6 md:hidden' />
      </main>

    </div>
  </div>
{/if}

<style lang="postcss">
  input { display: none; }

  .card-controls {
    z-index: -2;
    background-color: white;
  }

  :global(.dark) .card-controls,
  :global(.dark) .card-controls:after {
    background-color: theme('colors.gray.900');
    border-color: transparent;
  }
  .card-controls:after {
    content: '';
    position: absolute;
    background-color: white;
    width: calc(100% + 12px);
    left: -6px;
    bottom: calc(50% + 1px);
    z-index: -10;
    height: calc(50% + 1px);
  }

  @media (max-width: theme('screens.md')) {
    .container + :global(footer) {
      @apply hidden;
    }

    :global(body) {
      overflow: hidden;
    }
    main {
      height: calc(100vh - 38px);
      overflow-y: scroll;
      @apply pb-24;
    }
  }

</style>
