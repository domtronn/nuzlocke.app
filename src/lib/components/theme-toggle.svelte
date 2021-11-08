<script>
  import { theme } from '$lib/store'

  import Toggle from 'svelte-toggle'
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

<span class='inline-flex gap-x-2 items-center mr-4'>
  <Icon size='1.2em' className='dark:text-gray-200 fill-current' src={DarkMode} />

  <Toggle
    toggled={$theme === 'dark'}
    on:toggle={toggleTheme}
    small hideLabel label='Dark mode'
    />
</span>
