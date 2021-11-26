<script>
  import { groupBy } from '$lib/utils/arr'
  import { capitalise, unslugify } from '$lib/utils/string'

  import { createEventDispatcher } from 'svelte'
  import { fly, fade } from 'svelte/transition'

  const dispatch = createEventDispatcher()

  import Portal from 'svelte-portal/src/Portal.svelte'
  import Icon from 'svelte-icons-pack'

  import X from 'svelte-icons-pack/bi/BiX'
  import Menu from 'svelte-icons-pack/bi/BiMenu'
  import ArrowToTop from 'svelte-icons-pack/bi/BiArrowToTop'

  export let route = [], className = ''
  export let show = false

  const bosses = route.reduce((acc, r, i) => r.type === 'gym' ? acc.concat({ ...r, oid: i }) : acc, [])
  const grouped = groupBy('group', bosses)
  const onnav = (value) => _ => dispatch('nav', { value })

  const groups = ['gym-leader', 'elite-four', 'rival', 'evil-team']
</script>

<Portal target='#sidenav_button' hidden>
  <button
    in:fade
    on:click={_ => show = !show}
    aria-label={show ? 'Close menu' : 'Open menu'}
    class='umami--sidenav--{show ? 'close' : 'open'} h-full transition text-white sm:text-gray-600 dark:text-black md:dark:text-gray-400 md:dark:hover:text-gray-100 w-11 h-11 flex items-center justify-center rounded-full bg-gray-900 shadow-lg sm:shadow-none dark:bg-white sm:bg-transparent dark:sm:bg-transparent text-center {className}'
  >
    <Icon size='1.2rem' src={show ? X : Menu} className='fill-current transform scale-150 sm:transform-none' />
  </button>
</Portal>

{#if show}
  <section transition:fly={{ x: 250, opacity: 1 }}
      class='fixed bg-gray-50 dark:bg-gray-900 border-l-2 border-gray-200 dark:border-gray-600 h-full top-1/2 right-0 -translate-y-1/2 px-8 py-4 overflow-y-scroll text-gray-600 dark:text-gray-400 {className}'
  >
    <button on:click={_ => show = !show} class=umami--sideanv--close >
      <Icon src={X} size='1.8rem' className='-ml-2 mb-2 fill-current transition-colors hover:cursor-pointer text-gray-800 hover:text-black dark:text-gray-500 dark:hover:text-gray-200' />
    </button>

    <br />

    <span
      on:click={_ => {
        document.getElementById('svelte').scrollIntoView({ behavior: 'smooth' })
        show = !show
      }}
      class='umami--click--back-to-top text-sm -ml-6 -translate-x-0.5 inline-flex items-center gap-x-1 mt-2 underline transition hover:text-black dark:hover:text-gray-200 hover:cursor-pointer'
    >
      <Icon src={ArrowToTop} size='1.3em' className='fill-current ml-1 -mr-.5' />
      Back to top
    </span>

    <br />

    <slot name='continue' />

    {#each groups as group}
      <h3 class='text-lg font-light text-gray-800 dark:text-gray-200 mt-4'>{capitalise(unslugify(group))}</h3>
      {#each grouped[group] as b}
        <ul>
          <li class='text-xs underline hover:text-black dark:hover:text-gray-200 hover:scale-110 hover:cursor-pointer origin-left transition' on:click={onnav(b.oid)}>
            {b.name}
          </li>
        </ul>
      {/each}
    {/each}
  </section>
{/if}

<style>
  section { z-index: 999; }
</style>
