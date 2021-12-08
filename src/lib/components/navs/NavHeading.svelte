<script>
  import { page } from '$app/stores'

  import Icon from 'svelte-icons-pack'
  import Home from 'svelte-icons-pack/ai/AiOutlineHome'

  import ThemeToggle from '$lib/components/theme-toggle.svelte'

</script>


<nav>

  <span class='float-right'>
    <ThemeToggle className=mt-2 />
  </span>
</nav>

<style>
  nav { @apply container mx-auto mb-8 md:mb-2 py-4 -mb-16 sm:text-black sm:bg-transparent; }

  :global(.dark) nav { @apply text-gray-200; }

  a {
    @apply border-b-2 ml-4 pb-1 border-b-transparent transition hover:border-b-current;
  }

</style>
