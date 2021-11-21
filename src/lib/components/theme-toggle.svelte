<script>
  import { theme } from '$lib/store'

  import Icon from 'svelte-icons-pack'
  import DarkMode from 'svelte-icons-pack/ti/TiLightbulb'

  const toggleTheme = () => {
    if ($theme === 'dark') {
      theme.set('light')
      document.documentElement.classList.remove('dark')
    } else {
      theme.set('dark')
      document.documentElement.classList.add('dark')
    }
  }
</script>

<button class='px-2 umami--click--toggle-{$theme}' aria-label={$theme === 'dark' ? 'Light mode' : 'Dark mode'} on:click={toggleTheme}>
  <Icon size='1.2em' className='dark:text-gray-200 fill-current' src={DarkMode} />
</button>
