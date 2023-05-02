<script>
  import { browser, dev } from '$app/environment'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import { createUser, readdata } from '$lib/store'

  import { setContext } from 'svelte'

  import { RegionMap } from '$lib/data/games'
  import { GameHeading, NavHeading } from '$c/navs'

  import { fetchData, fetchLeague } from '$utils/fetchers'
  import { normalise } from '$utils/string'

  import Modal from 'svelte-simple-modal'
  import deferStyles from '$lib/utils/defer-styles'

  let path = $page.url.pathname

  const [, gameKey] = browser ? readdata() : []
  setContext('region', RegionMap[gameKey] ?? 'unknown')

  onMount(() => {
    const [, id, , game] = readdata()
    if (id === 'blazingem') deferStyles('/assets/pokemon-blazingem.css')
    if (id?.includes('radred')) deferStyles('/assets/pokemon-radicalred.css')

    if (!dev)
      import('@sentry/svelte').then((Sentry) => {
        Sentry.init({
          dsn: 'https://c785c122f32c47d68a777aea5af577b1@o1091749.ingest.sentry.io/6109144',
          integrations: [
            new Sentry.BrowserTracing(),
            new Sentry.Replay({
              maskAllText: false,
              blockAllMedia: true
            })
          ],
          tracesSampleRate: 0.1,
          replaysSessionSampleRate: 0,
          replaysOnErrorSampleRate: 1.0
        })
        Sentry.setContext('game', game)
      })
  })

  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: () => fetchData().then(res => Object.values(res.idMap)),
    getPkmn: (id) =>
    fetchData().then((p = {}) => {
      const nid = normalise(id)
      return p.idMap[nid] || p.nameMap[nid] || p.aliasMap[nid]
    }),
    getPkmns: (ids = []) =>
    fetchData().then((p = {}) =>
      ids
        .reduce((acc, it) => {
          const nid = normalise(it)
          const res = p.idMap[nid] || p.nameMap[nid] || p.aliasMap[nid]

          if (!res) {
            console.error('Error reading ', nid)
            return acc
          }

          return { ...acc, [res.alias]: res }
        }, {})
      )
  })

  const onresize = () => (document.body.height = window.innerHeight)

  $: createUser()
</script>

<svelte:window on:resize={onresize} />

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  classBg="modal-positioning overflow-y-scroll"
  classWindowWrap="!m-4"
  classWindow="!bg-transparent"
  classContent="!p-0 !overflow-visible"
>
  {#if ['/game', '/box', '/graveyard'].includes(path)}
    <GameHeading />
  {:else}
    <NavHeading />
  {/if}
  <slot />
</Modal>
