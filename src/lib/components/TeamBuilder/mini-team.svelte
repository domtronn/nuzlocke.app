<script>
  import { PIcon, Icon } from '$c/core'
  import { X, Plus } from '$icons'
  import { fade, scale } from 'svelte/transition'
  import { drag } from '$utils/drag'

  import { ModalController } from './'

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let mons = [],
    iconKey

  //  Action types
  let action, over

  const getAttr = (target, attr) => {
    return (
      target.getAttribute(attr) ||
      target.querySelector(`[${attr}]`)?.getAttribute(attr) ||
      target.closest(`[${attr}]`)?.getAttribute(attr)
    )
  }

  function dragAdd(evt) {
    dragOver(evt)
    action = getAttr(evt.target, 'data-drag-action')
  }

  function dragReplace(evt) {
    dragOver(evt)
    action = getAttr(evt.target, 'data-drag-action')
  }

  function dragOver(evt) {
    over =
      evt.target.getAttribute('data-drag-id') ||
      evt.target
        .querySelector('[data-drag-id]')
        ?.getAttribute('[data-drag-id]') ||
      evt.target.closest('[data-drag-id]')?.getAttribute('[data-drag-id]')

    return false
  }

  function dragLeave() {
    over = null
    action = null
  }

  function onDrop(evt) {
    evt.stopPropagation()
    const data = JSON.parse(evt.dataTransfer.getData('data'))
    const srcId = +evt.dataTransfer.getData('srcId')
    const act = evt.dataTransfer.getData('effect') === 'move' ? 'swap' : action

    if (!over) return dragLeave()

    dispatch(act, { data, targetId: +over, srcId })
    dragLeave()
  }

  function onSubmit(evt) {
    evt.detail.forEach((data, targetId) => {
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

<div
  class="mx-auto inline-flex items-center gap-x-4 md:mt-0.5 md:scale-110 md:transform {$$restProps.class ||
    ''}"
>
  {#each mons as p, i}
    <button
      use:drag={{ data: p, id: i, effect: 'move' }}
      on:click={onRemove(p)}
      title="Remove {p.pokemon} from your team"
      aria-label="Remove {p.pokemon} from your team"
      on:dragenter={dragReplace}
      on:dragleave={dragLeave}
      on:drop={onDrop}
      data-drag-id={i}
      data-drag-action="replace"
      class:opacity-50={over && +over === i}
      ondragover="return false"
      class="group relative h-10 w-10 cursor-pointer transition"
    >
      <span class="pointer-events-none" in:scale={{ duration: 500 }}>
        <PIcon
          class="pointer-events-none absolute left-1/2 top-1/2 -mt-0.5 -translate-y-1/2 -translate-x-1/2 opacity-30 dark:opacity-80 dark:contrast-50"
          name="unknown-pokemon2"
        />

        <PIcon
          class="data-drag-img pointer-events-none absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 scale-150 transform"
          name={p?.[iconKey]}
        />
      </span>

      <Icon
        class="pointer-events-none absolute left-1/2 -bottom-4 -translate-x-1/2 opacity-0 transition group-hover:opacity-100"
        inline
        icon={X}
      />
    </button>
  {/each}

  {#each Array(6 - mons.length).fill() as _, i}
    <ModalController on:submit={onSubmit} {mons}>
      <p
        on:dragenter={dragAdd}
        on:dragleave={dragLeave}
        on:drop={onDrop}
        class:opacity-40={over && +over === i + mons.length}
        data-drag-id={i + mons.length}
        data-drag-action="add"
        ondragover="return false"
        class="group relative h-10 w-10 cursor-pointer transition"
      >
        <PIcon
          class="pointer-events-none absolute left-1/2 top-1/2 -mt-[2px] -translate-y-1/2 -translate-x-1/2 opacity-40 brightness-200 contrast-200 transition group-hover:opacity-100 dark:contrast-0"
          name="unknown-pokemon2"
        />

        <Icon
          class="pointer-events-none absolute right-0.5 top-1 rounded-full bg-white opacity-0 transition group-hover:opacity-100 dark:bg-gray-800 dark:text-gray-400"
          inline
          icon={Plus}
        />
      </p>
    </ModalController>
  {/each}
</div>
