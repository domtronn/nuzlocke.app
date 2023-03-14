<script>
  import { onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import PokemonCard from '$lib/components/pokemon-card.svelte'

  import { Loader, IconButton } from '$lib/components/core'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import { Modal as AnalysisModal } from '$lib/components/Analysis'

  import { getBox, updatePokemon, killPokemon } from '$lib/store'
  import { canonTypes as types } from '$lib/data/types'
  import { stats, StatIconMap } from '$lib/data/stats'

  import { SPRITE, CUSTOM, createImgUrl } from '$utils/rewrites'
  import { toDb } from '$utils/link'
  import deferStyles from '$utils/defer-styles'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Shiny } from '$icons'
  import { X } from '$icons'
  import { Deceased } from '$icons'
  import { External } from '$icons'

  const { getPkmns, getPkmn } = getContext('game')
  const { open } = getContext('simple-modal')

  let Particles, EvoModal
  onMount(() => {
    deferStyles('/assets/pokemon.css')
    import('$lib/components/particles').then(m => Particles = m.default)
    import('$lib/components/EvolutionModal.svelte').then(m => EvoModal = m.default)

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

  const handleKill = o => _ => {
    ogbox = ogbox.filter(i => toid(i) !== toid(o))
    killPokemon(o)
  }
</script>
{#if loading}
  <Loader />
{:else}
  <div out:fade|local={{ duration: 250 }} in:fade|local={{ duration: 250, delay: 300 }} class='container mx-auto'>
    <div class='flex flex-col mx-auto items-center justify-center'>
      <main class='w-full sm:w-3/4 flex flex-col gap-y-4 py-6 pb-32 px-4 md:px-8 overflow-hidden'>

        <div class='relative mb-6 -mt-6 sm:-my-2'>
          <AnalysisModal box={Object.values(Pokemon)} />
        </div>

        <div class='inline-flex flex-wrap sm:flex-row gap-y-2 gap-x-4 sm:items-start z-50 mt-2'>
          <div class='grid sm:grid-rows-2 grid-cols-8 w-full sm:w-auto sm:grid-cols-5 gap-1 sm:gap-2 col-span-2'>
            <IconButton
              rounded
              src={X}
              title='Clear filters'
              containerClassName='flex flex-col order-last sm:row-span-2 sm:order-none items-center justify-center'
              disabled={!enabled}
              on:click={clear}
            />

            {#each ['total'].concat(stats) as s}
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

          <div class='w-full sm:w-auto grid grid-cols-5 md:grid-cols-9 gap-x-2 gap-y-2 col-span-3'>
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
        </div>

        <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-6'>
          {#if box.length === 0}
            <span class='h-96 flex items-center justify-center col-span-4 dark:text-gray-600 text-xl'>You have no Pokémon in your box</span>
          {/if}
          {#each box.filter(filter) as p (p)}
            <span
              animate:flip={{ duration: d => 10 * Math.sqrt(d) }}
              out:fade={{ duration: 150 }}
            >
              {#key p}
              <PokemonCard
                sprite={createImgUrl(Pokemon[p.pokemon], { shiny: p.status === 6, ext: 'webp' })}
                fallback={createImgUrl(Pokemon[p.pokemon], { shiny: p.status === 6, ext: 'png' })}
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

                <span class='text-xs text-center p-2 -mt-4 text-gray-500 z-40' slot="footer" let:id>
                  {#if p.location === 'Starter'}
                    Met in a fateful encounter
                  {:else if p.type !== 'custom'}
                    <!-- FIXME: Allow custom location data -->
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

                  <div class='card-controls absolute -bottom-4 flex left-1/2 -translate-x-1/2 border border-gray-200 bg-red-200 rounded-lg shadow-md'>
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
                  </div>

                </span>
              </PokemonCard>
              {/key}
            </span>
          {/each}
        </div>
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
</style>
