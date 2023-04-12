<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { dev } from '$app/environment'

  import { createUser } from '$lib/store'
  let path = $page.url.pathname;

  import { setContext } from 'svelte';

  import { fetchData, fetchLeague } from '$utils/fetchers';
  import { GameHeading, NavHeading } from '$c/navs';

  import Modal from 'svelte-simple-modal';

  onMount(() => {
    import("@sentry/svelte").then(Sentry => {
      Sentry.init({
        dsn: "https://c785c122f32c47d68a777aea5af577b1@o1091749.ingest.sentry.io/6109144",
        integrations: [new Sentry.BrowserTracing()],
        tracesSampleRate: 1.0,
      })
    });
  })

  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: fetchData,
    getPkmn: (id) =>
      fetchData().then((ps = []) =>
        ps.find(
          (p) => p.num == id || p.name.toLowerCase() == id || p.alias == id || p.sprite == id
        )
      ),
    getPkmns: (ids = []) =>
      fetchData().then((ps = []) =>
        ps
          .filter(
            (p) =>
              ids.includes(p.num) ||
              ids.includes(p.name.toLowerCase()) ||
              ids.includes(p.alias)
          )
          .reduce((acc, it) => ({ ...acc, [it.alias]: it }), {})
      )
  });

  const onresize = () => document.body.height = window.innerHeight

  $: createUser()
</script>

<svelte:window on:resize={onresize} />

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  classBg='modal-positioning overflow-y-scroll'
  classWindowWrap='!m-4'
  classWindow='!bg-transparent'
  classContent='!p-0 !overflow-visible'
>
  {#if ['/game', '/box', '/graveyard'].includes(path)}
    <GameHeading />
  {:else}
    <NavHeading />
  {/if}
  <slot />
</Modal>
