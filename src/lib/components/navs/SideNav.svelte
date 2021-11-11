<script>
  import { groupBy } from '$lib/utils/arr'
  import { capitalise, unslugify } from '$lib/utils/string'

  import { createEventDispatcher } from 'svelte'
  import { fly, fade } from 'svelte/transition'

  const dispatch = createEventDispatcher()

  import Portal from 'svelte-portal'
  import Icon from 'svelte-icons-pack'

  import X from 'svelte-icons-pack/bi/BiX'
  import Menu from 'svelte-icons-pack/bi/BiMenu'
  import ArrowToTop from 'svelte-icons-pack/bi/BiArrowToTop'

  export let route = [], className = ''
  let show = false

  const bosses = route.reduce((acc, r, i) => r.type === 'gym' ? acc.concat({ ...r, oid: i }) : acc, [])
  const grouped = groupBy('group', bosses)
  const onnav = (value) => _ => dispatch('nav', { value })

  const groups = ['gym-leader', 'elite-four', 'rival', 'evil-team']
</script>

<Portal target='#sidenav_button' hidden>
  <button
    in:fade
    on:click={_ => show = !show}
    aria-label='Open menu'
    class='h-full transition dark:text-gray-500 dark:hover:text-gray-200 {className}'
    >
    <Icon size='1.2rem' src={Menu} className='fill-current' />
  </button>
</Portal>

{#if show}
  <ul transition:fly={{ x: 250, opacity: 1 }}
      class='fixed bg-gray-50 z-20 dark:bg-gray-900 border-l border-gray-200 dark:border-black h-full top-1/2 right-0 -translate-y-1/2 px-8 py-4 text-gray-600 dark:text-gray-400 {className}'
  >
    <button on:click={_ => show = !show}>
      <Icon src={X} size='1.8rem' className='-ml-2 mb-2 fill-current transition-colors hover:cursor-pointer text-gray-800 hover:text-black dark:text-gray-500 dark:hover:text-gray-200' />
    </button>

    {#each groups as group}
      <h3 class='text-lg font-light text-gray-800 dark:text-gray-200 mt-4'>{capitalise(unslugify(group))}</h3>
      {#each grouped[group] as b}
        <li class='text-xs underline hover:text-black dark:hover:text-gray-200 hover:scale-110 hover:cursor-pointer origin-left transition' on:click={onnav(b.oid)}>
          {b.name}
        </li>
      {/each}
    {/each}

    <li
      on:click={_ => document.getElementById('sidenav_button').scrollIntoView({ behavior: 'smooth' })}
      class='text-sm inline-flex items-center gap-x-1 mt-4 underline transition hover:text-black dark:hover:text-gray-200 hover:cursor-pointer'
      >
      <Icon src={ArrowToTop} size='1.2em' className='fill-current' /> Back to top
    <li>
  </ul>
{/if}
