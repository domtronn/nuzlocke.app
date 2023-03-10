<script>
  import { page } from '$app/stores'
  let path = $page.url.pathname;

  import { setContext } from 'svelte';
  import { browser, dev } from '$app/environment';

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
</script>

{#if ['/game', '/box'].includes(path)}
  <GameHeading />
{:else}
  <NavHeading />
{/if}

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  styleWindow={{ background: 'transparent !important' }}
  styleContent={{ padding: '0 !important' }}
>
  <slot />
</Modal>
