<script>
  import { PIcon, Icon } from '$c/core'
  import { X, Plus } from '$icons'
  import { fade, scale } from 'svelte/transition'
  import { drag } from '$utils/drag'

  import { ModalController } from './'

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let mons = [], iconKey

  //  Action types
  let action, over

  const getAttr = (target, attr) => {
    return target.getAttribute(attr)
      || target.querySelector(`[${attr}]`)?.getAttribute(attr)
      || target.closest(`[${attr}]`)?.getAttribute(attr)
  }

  function dragAdd (evt) {
    dragOver(evt)
    action = getAttr(evt.target, 'data-drag-action')
    console.log('add', action)
  }

  function dragReplace (evt) {
    dragOver(evt)
    action = getAttr(evt.target, 'data-drag-action')
    console.log('replace', action)
  }

  function dragSwap (evt) {
    evt.stopPropagation()
    evt.dataTransfer.setDragImage(
      evt.target.querySelector('[data-drag-img]')
        || evt.target.querySelector('.data-drag-img')
        || evt.target, 5, 5)
  }

  function dragOver (evt) {
    console.log(evt.target)
    over = evt.target.getAttribute('data-drag-id')
      || evt.target.querySelector('[data-drag-id]')?.getAttribute('[data-drag-id]')
      || evt.target.closest('[data-drag-id]')?.getAttribute('[data-drag-id]')

    return false
  }

  function dragLeave () {
    over = null
    action = null
  }

  function onDrop (evt) {
    evt.stopPropagation()
    const data = JSON.parse(evt.dataTransfer.getData('data'))
    const srcId = +evt.dataTransfer.getData('srcId')
    console.log(' --- ', evt.dataTransfer)
    const act = evt.dataTransfer.getData('effect') === 'move' ? 'swap' : action

    if (!over) return dragLeave()

    console.log(act, { data, targetId: +over, srcId })
    dispatch(act, { data, targetId: +over, srcId })
    dragLeave()
  }

  function onSubmit (evt) {
    evt.detail.forEach((data, targetId) => {
      console.log('Adding', { data, targetId })
      dispatch('add', { data, targetId })
    })
  }

  const onRemove = (p) => (evt) => {
    dispatch('remove', {
      data: p,
      targetId: getAttr(evt.target, 'data-drag-id')
    })
  }


</script>


<div class='inline-flex gap-x-4 md:transform md:scale-110 mx-auto md:mt-0.5 items-center {$$restProps.class || ''}'>

  {#each mons as p, i}
    <button
      use:drag={{ data: p, id: i, effect: 'move' }}
      on:click={onRemove(p)}

      title='Remove {p.pokemon} from your team'
      aria-label='Remove {p.pokemon} from your team'

      on:dragenter={dragReplace}
      on:dragleave={dragLeave}
      on:drop={onDrop}

      data-drag-id={i}
      data-drag-action=replace

      class:opacity-50={over && +over === i}
      ondragover="return false"
      class='relative w-10 h-10 group transition cursor-pointer'
    >

      <span
        class='pointer-events-none'
        in:scale={{ duration: 500 }}
      >
        <PIcon
          class='pointer-events-none opacity-30 dark:opacity-80 dark:contrast-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 -mt-0.5'
          name=unknown-pokemon2
        />

      <PIcon
        class='data-drag-img pointer-events-none transform scale-150 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'
        name={p?.[iconKey]}
        />
      </span>

      <Icon
        class='absolute opacity-0 left-1/2 -translate-x-1/2 -bottom-4 pointer-events-none transition group-hover:opacity-100'
        inline icon={X} />

    </button>
  {/each}

{#each Array(6 - mons.length).fill() as _, i}
  <ModalController
    on:submit={onSubmit}
    {mons}
  >
    <p
      on:dragenter={dragAdd}
      on:dragleave={dragLeave}
      on:drop={onDrop}

      class:opacity-40={over && +over === (i + mons.length)}

      data-drag-id={i + mons.length}
      data-drag-action=add

      ondragover="return false"
      class='relative w-10 h-10 transition cursor-pointer group'
      >
      <PIcon
        class='dark:contrast-0 opacity-40 contrast-200 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none brightness-200 group-hover:opacity-100 transition -mt-[2px]'
        name=unknown-pokemon2
        />

      <Icon
        class='absolute opacity-0 right-0.5 top-1 bg-white dark:bg-gray-800 rounded-full pointer-events-none transition group-hover:opacity-100 dark:text-gray-400'
        inline icon={Plus} />

    </p>
  </ModalController>
  {/each}
</div>
