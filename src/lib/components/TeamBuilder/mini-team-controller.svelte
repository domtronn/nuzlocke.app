<script>
  import { IconButton, Icon } from '$c/core'
  import { X } from '$icons'

  import { MiniTeam } from './'
  import { toObj } from '$utils/obj'
  import { fade } from 'svelte/transition'
  import { getGameStore,
           readdata, readBox, readTeam, read,
           patch } from '$lib/store'
  let teamData = [], boxData = [], setTeam = _ => _, gameStore

  async function setup() {
    const [,, id] = readdata()

    gameStore = getGameStore(id)
    gameStore.subscribe(read(data => {
      teamData = readTeam(data)
      boxData = data
    }))

    setTeam = (data) => gameStore.update(patch({ __team: data }))
  }

  const locid = (evt) => evt.detail.data.locationId || evt.detail.data.location

  const onteamadd = (evt) => {
    setTeam(
      [].concat(teamData)
        .filter(i => i !== locid(evt))
        .concat(locid(evt))
    )
  }

  const onteamremove = (evt) => {
    setTeam([].concat(teamData).filter(i => i !== locid(evt)))
  }

  const onteamreplace = (evt) => {
    if ([].concat(teamData).includes(locid(evt)))
      return onteamswap({ detail: {
        ...evt.detail,
        srcId: [].concat(teamData).findIndex(id => id === locid(evt))
      }})

    setTeam(
      [].concat(teamData).map((id, i) => id === +evt.detail.targetId ? locid(evt) : id)
    )
  }

  const onteamswap = (evt) => {
    const targetId = Math.min(evt.detail.targetId, [].concat(teamData).length - 1)
    const srcId = evt.detail.srcId

    setTeam(
      [].concat(teamData).map((it, i, arr) => {
        if (i === targetId) return arr[srcId]
        if (i === srcId) return arr[targetId]
        return it
      })
    )
  }

  const onteamclear = () => setTeam([])

  $: mons = (teamData || []).map(t => boxData[t])
</script>

{#await setup() then}
  <div transition:fade|local={{ delay: 500 }} class=safe-bottom>
    <MiniTeam
      class='transform max-md:scale-75 {$$restProps.class || ''}'
      iconKey=pokemon
      on:add={onteamadd}
      on:swap={onteamswap}
      on:remove={onteamremove}
      on:replace={onteamreplace}
      {mons}
      />
    <IconButton
      on:click={onteamclear}
      title='Clear your team'
      disabled={!mons?.length}
      borderless
      containerClassName='float-right rounded-full !border-gray-900 z-50 -translate-x-1/2 md:translate-x-1/2 mt-1'
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
      @apply fixed w-full left-4 bottom-0 py-2 pb-2 border-t-2 bg-white/50 backdrop-blur-sm border-gray-200
    }

    :global(.dark) div {
      @apply bg-gray-800/80 border-gray-900;
    }
  }

</style>
