<script>
  import { page } from '$app/stores'

  import Icon from 'svelte-icons-pack'
  import Home from 'svelte-icons-pack/ai/AiOutlineHome'

  import ThemeToggle from '$lib/components/theme-toggle.svelte'

</script>


<nav class='container mx-auto mb-8 md:mb-2 py-4 -mb-16 dark:sm:text-gray-200 sm:text-black sm:bg-transparent'>
  <div class="w-full sm:w-2/3 md:w-3/4 sm:px-4 md:px-8 mx-auto flex items-center justify-between">
    {#if $page.path !== '/'}
      <a
        href="/"
        rel="external"
        class='border-b-2 ml-4 pb-1 border-b-transparent transition hover:border-b-current'>
        <Icon src={Home} size='1.4rem' className='fill-current' />
      </a>
    {:else}
      <span />
    {/if}

    <ThemeToggle />
  </div>
</nav>
