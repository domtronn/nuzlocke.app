<script>
  import Modal from 'svelte-simple-modal'
  import { GameHeading } from '$c/navs'
</script>

<svelte:head>
  <meta name="robots" content="nofollow, noindex" />
</svelte:head>

<Modal
  closeButton={false}
  styleBg={{ background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
  classBg="modal-positioning overflow-y-scroll"
  classWindowWrap="!m-4"
  classWindow="!bg-transparent"
  classContent="!p-0 !overflow-visible"
>
  <GameHeading />
  <slot />
</Modal>
