<script>
  import { theme } from '$lib/store'
  import { fly, fade } from 'svelte/transition'
  import { sineInOut } from 'svelte/easing';

  import Icon from 'svelte-icons-pack'
  import DarkMode from 'svelte-icons-pack/io/IoMoon'
  import LightMode from 'svelte-icons-pack/io/IoSunny'

  export let className = ''

  const toggleTheme = () => {
    if ($theme === 'dark') {
      theme.set('light')
      document.documentElement.classList.remove('dark')
    } else {
      theme.set('dark')
      document.documentElement.classList.add('dark')
    }
  }

  const fadefly = (node, { duration, delay, y }) => {
    return {
      duration,
      delay,
      css: t => {
        const easing = sineInOut(t)
        return `
          transform: scale(${easing}) translateY(${y - (easing * y)}px);
          opacity: ${easing};
`
      }
    }
  }

  const duration = 300
  const delay = duration
  const y = 50

</script>

<button class='{className} relative w-16 h-full umami--click--toggle-{$theme}' aria-label={$theme === 'dark' ? 'Light mode' : 'Dark mode'} on:click={toggleTheme}>
  {#if $theme == 'light'}
    <div in:fadefly={{ duration, delay, y: -y }} out:fadefly={{ duration, y: -y }} >
      <Icon size='1.2em' className='-mt-2 absolute left-1/2 -translate-x-1/2 text-white sm:hover:text-black sm:text-gray-800 transition fill-current' src={DarkMode} />
    </div>
  {:else if $theme == 'dark'}
    <div in:fadefly={{ duration, delay, y }} out:fadefly={{ duration, y }}>
      <Icon size='1.2em' className='-mt-2 absolute left-1/2 -translate-x-1/2 hover:text-white text-gray-200 transition fill-current' src={LightMode} />
    </div>
  {/if}
</button>
