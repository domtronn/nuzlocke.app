<script>
  import { onMount, getContext } from 'svelte'
  import { IconButton } from '$lib/components/core'
  import { Bubbles } from '$lib/utils/pattern'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Analysis } from '$icons'

  export let box
  let Modal
  onMount(() => {
    import('$lib/components/Analysis/index.svelte').then(m => Modal = m.default)
  })

  const fetchanalysis = (box) =>
    fetch('/api/box/analysis.json', {
      method: 'POST',
      body: JSON.stringify({ box }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())

  const { open } = getContext('simple-modal')
  const onopen = async _ => {
    const analysis = await fetchanalysis(box)
    open(Modal, { ...analysis, count: box.length })
  }
</script>

<IconButton
  rounded
  disabled={!box || !box.length}
  title='Open Analysis'
  containerClassName='absolute w-full sm:w-auto md:relative'
  on:click={onopen}
>
  <span style='--img-dark: url("{Bubbles('#fff')}"); --img: url("{Bubbles('#000')}")'
        class:disabled={!box || !box.length}
        class='px-3 py-1 gap-x-1 inline-flex items-center' slot=icon>
    <Icon inline={true} height=1.2em icon={Analysis} class=fill-current />
    Research team
  </span>
</IconButton>

<style>
  span.disabled::before {
    background: none !important;
  }

  span::before {
    content: '';
    @apply transition duration-200 absolute inset-0;
    animation: animatedBackground 480s linear infinite forwards;
    background-image: var(--img);
    opacity: 0.075;
  }

  :global(.dark) span::before {
    background-image: var(--img-dark);
  }

  span:hover::before {
    animation: animatedBackground 120s linear infinite forwards;
    @apply duration-500;
    opacity: 0.4;
  }

  @keyframes animatedBackground {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 6000%;
    }
  }
</style>
