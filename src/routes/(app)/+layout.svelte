<script>
  import { page } from '$app/stores'
  import { createUser, savedGames, activeGame, parse } from '$lib/store'
  let path = $page.url.pathname;

  import { setContext } from 'svelte';
  import { browser, dev } from '$app/environment';

  import { getSetting } from '$c/Settings/_data'

  import { fetchData, fetchLeague } from '$utils/fetchers';
  import { GameHeading, NavHeading, CookieBanner, Footer } from '$c/navs';
  import Modal from 'svelte-simple-modal';

  setContext('game', {
    getLeague: fetchLeague,
    getAllPkmn: fetchData,
    getPkmn: (id) =>
      fetchData().then((ps = []) =>
        ps.find(
          (p) => p.num == id || p.name == id || p.alias == id || p.sprite == id
        )
      ),
    getPkmns: (ids = []) =>
      fetchData().then((ps = []) =>
        ps
          .filter(
            (p) =>
              ids.includes(p.num) ||
              ids.includes(p.name) ||
              ids.includes(p.alias)
          )
          .reduce((acc, it) => ({ ...acc, [it.alias]: it }), {})
      )
  });

  $: createUser()
</script>

{#if ['/game', '/box', '/graveyard'].includes(path)}
  <GameHeading />
{:else}
  <NavHeading />
{/if}

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  classBg='modal-positioning overflow-y-scroll'
  classWindowWrap='!m-4'
  classWindow='!bg-transparent'
  classContent='!p-0 !overflow-visible'
>
  <slot />
</Modal>
