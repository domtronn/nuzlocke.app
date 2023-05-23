<script>
  import { browser, dev } from '$app/environment'
  import { setContext, afterUpdate } from 'svelte'

  import { page } from '$app/stores'
  import { createUser, readdata } from '$lib/store'

  import { RegionMap } from '$lib/data/games'

  import { fetchData, fetchLeague } from '$utils/fetchers'
  import { normalise } from '$utils/string'

  import deferStyles from '$lib/utils/defer-styles'

  let path = $page.url.pathname

  const [, gameKey] = browser ? readdata() : []
  setContext('region', RegionMap[gameKey] ?? 'unknown')

  afterUpdate(() => {
    const [, id, , game] = readdata()

    if (id === 'blazingem') deferStyles('/assets/pokemon-blazingem.css')
    if (id?.includes('radred')) deferStyles('/assets/pokemon-radicalred.css')
    if (browser) setTimeout(() => document.body.classList.add('lazy-pkm'), 0)
  })

  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: () => fetchData().then((res) => Object.values(res.aliasMap)),
    getPkmn: (id) =>
      fetchData().then((p = {}) => {
        const nid = normalise(id)
        return p.idMap[nid] || p.aliasMap[nid] || p.nameMap[nid]
      }),
    getPkmns: (ids = []) =>
      fetchData().then((p = {}) => {
        let result = {}
        for (const id of ids) {
          const nid = normalise(id).trim()
          const res = p.idMap[nid] || p.aliasMap[nid] || p.nameMap[nid]

          if (!nid) continue
          if (!res) {
            console.error('Error reading ', nid)
            continue
          }

          result[res.alias] = res
        }
        return result
      })
  })

  const onresize = () => (document.body.height = window.innerHeight)

  $: createUser()
</script>

<svelte:window on:resize={onresize} />
<svelte:head>
  <link
    rel="preload"
    as="image"
    href="https://img.nuzlocke.app/assets/pokemon-v6.png"
  />
</svelte:head>

<slot />
