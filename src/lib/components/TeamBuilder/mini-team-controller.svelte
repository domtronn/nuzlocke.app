<script>
  import { IconButton, Icon } from '$c/core'
  import { X, Ball, Plus } from '$icons'

  import { MiniTeam } from './'
  import { toObj } from '$utils/obj'
  import { fade } from 'svelte/transition'
  import { getGameStore,
           readdata, readBox, readTeam, read,
           patch } from '$lib/store'
  let teamData = [], boxData = [], boxLength = 0, setTeam = _ => _, gameStore, seenTeam

  async function setup() {
    const [,, id] = readdata()

    gameStore = getGameStore(id)
    gameStore.subscribe(read(data => {
      seenTeam = Object.hasOwnProperty.call(data, '__team')
      teamData = readTeam(data)
      boxData = readBox(data).reduce((acc, it) => ({ ...acc, [locid({detail: {data: it}})]: it }), {})
      boxLength = readBox(data).length
    }))

    setTeam = (data) => gameStore.update(patch({ __team: data }))
  }

  const locid = (evt) => evt.detail.data.customId || evt.detail.data.location
  const toarray = (data) => teamData ? [].concat(teamData) : []

  const onteamadd = (evt) => {
    setTeam(
      toarray(teamData)
        .filter(i => i !== locid(evt))
        .concat(locid(evt))
    )
  }

  const onteamremove = (evt) => {
    setTeam(toarray(teamData).filter(i => i !== locid(evt)))
  }

  const onteamreplace = (evt) => {
    if (toarray(teamData).includes(locid(evt)))
      return onteamswap({ detail: {
        ...evt.detail,
        srcId: toarray(teamData).findIndex(id => id === locid(evt))
      }})

    setTeam(
      toarray(teamData).map((id, i) => id === +evt.detail.targetId ? locid(evt) : id)
    )
  }

  const onteamswap = (evt) => {
    const targetId = Math.min(evt.detail.targetId, toarray(teamData).length - 1)
    const srcId = evt.detail.srcId

    setTeam(
      toarray(teamData).map((it, i, arr) => {
        if (i === targetId) return arr[srcId]
        if (i === srcId) return arr[targetId]
        return it
      })
    )
  }

  const onteamclear = () => setTeam([])

  $: mons = (teamData || []).map(t => boxData[t]).filter(i => i)
</script>

{#await setup() then}
  <div transition:fade|local={{ delay: 500 }} class=safe-bottom>
    <MiniTeam
      class='transform max-md:scale-75 md:pl-8 {$$restProps.class || ''}'
      iconKey=pokemon
      on:add={onteamadd}
      on:swap={onteamswap}
      on:remove={onteamremove}
      on:replace={onteamreplace}
      {mons}
      />

    {#if !mons.length && boxLength}
    <small
      in:fade={{ duration: 500 }}
      out:fade={{ duration: 200 }}
      class:hidden={seenTeam}
      class='md:block italic text-gray-500 left-1/2 -translate-x-1/2 w-full mb-1 translate-y-full md:bottom-2 absolute'
    >
      Drag Pokémon from your box or click add to team
      <span class=relative>
        <Icon class='absolute transform scale-110 top-0.5 -right-4' inline icon={Ball} />
        <Icon class='absolute transform scale-75 -right-6 -translate-x-0.5 -top-0.5 bg-white dark:bg-gray-800 rounded-full' inline icon={Plus} />
      </span>
    </small>
    {/if}

    <IconButton
      on:click={onteamclear}
      title='Clear your team'
      disabled={!mons?.length}
      borderless
      containerClassName=' rounded-full !border-gray-900 z-50 -translate-x-3/4 md:translate-x-1/2 md:mt-1'
      src={X}
    />
  </div>
{/await}


<style>
  div {
    @apply w-auto relative flex items-center text-center mx-auto;
  }

  @media (max-width: theme('screens.md')) {
    div {
      @apply fixed w-full pl-6 bottom-0 pt-3 pb-5 border-t-2 bg-white/50 backdrop-blur-sm border-gray-200
    }

    :global(.dark) div {
      @apply bg-gray-800/80 border-gray-900;
    }
  }

</style>
