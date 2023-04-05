<script>
  import { MiniTeam } from './'
  import { toObj } from '$utils/obj'
  import { fade } from 'svelte/transition'
  import { getTeams, setTeam, getBox, readdata, readBox, read, patch } from '$lib/store'
  let teamData = [], boxData = [], gameStore

  async function setup() {
    const [,, id] = readdata()

    getTeams(t => teamData = t.team)
    getBox(b => boxData = toObj(b))
  }

  const onteamadd = (evt) => {
    setTeam(
      teamData
        .filter(i => i !== evt.detail.data.id)
        .concat(evt.detail.data.id)
    )
  }

  const onteamremove = (evt) => {
    setTeam(teamData.filter(i => i !== evt.detail.data.id))
  }

  const onteamreplace = (evt) => {
    if (teamData.includes(evt.detail.data.id))
      return onteamswap({ detail: {
        ...evt.detail,
        srcId: teamData.findIndex(id => id === evt.detail.data.id)
      }})

    setTeam(
      teamData.map((id, i) => i === +evt.detail.targetId ? evt.detail.data.id : id)
    )
  }

  const onteamswap = (evt) => {
    const targetId = Math.min(evt.detail.targetId, teamData.length - 1)
    const srcId = evt.detail.srcId

    setTeam(
      teamData.map((it, i, arr) => {
        if (i === targetId) return arr[srcId]
        if (i === srcId) return arr[targetId]
        return it
      })
    )
  }

  $: mons = (teamData || []).map(t => boxData[t])
</script>

{#await setup() then}
  <div transition:fade class=safe-bottom>
    <MiniTeam
      class={$$restProps.class || ''}
      iconKey=pokemon
      on:add={onteamadd}
      on:swap={onteamswap}
      on:remove={onteamremove}
      on:replace={onteamreplace}
      {mons}
      />
  </div>
{/await}


<style>
  div {
    z-index: 9999;
    @apply w-auto relative flex items-center text-center mx-auto;
  }

  @media (max-width: theme('screens.md')) {
    div {
      @apply fixed w-full bottom-0 py-3 pb-3.5 border-t-2 bg-white/50 backdrop-blur-sm border-gray-200
    }

    :global(.dark) div {
      @apply bg-gray-800/80 border-gray-900;
    }
  }

</style>
