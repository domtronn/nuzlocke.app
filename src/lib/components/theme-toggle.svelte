<script>
  import { theme } from '$lib/store'
  import { sineInOut } from 'svelte/easing'

  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { DarkMode } from '$icons'
  import { LightMode } from '$icons'

  export let className = ''

  const toggleTheme = (e) => {
    if (e.altKey)
      return document.documentElement.classList.toggle('greenscreen')

    document.documentElement.classList.remove('greenscreen')
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
      css: (t) => {
        const easing = sineInOut(t)
        return `
          transform: scale(${easing}) translateY(${y - easing * y}px);
          opacity: ${easing};
`
      }
    }
  }

  const duration = 150
  const delay = duration
  const y = 50
</script>

<button
  class="{className} relative h-full w-10 sm:w-16"
  aria-label={$theme === 'dark' ? 'Light mode' : 'Dark mode'}
  on:click={toggleTheme}
>
  {#if $theme == 'light'}
    <div
      in:fadefly={{ duration, delay, y: -y }}
      out:fadefly={{ duration, y: -y }}
    >
      <Icon
        inline={true}
        height="1.2em"
        class="absolute left-1/2 -mt-2 -translate-x-1/2 fill-current transition"
        icon={DarkMode}
      />
    </div>
  {:else if $theme == 'dark'}
    <div in:fadefly={{ duration, delay, y }} out:fadefly={{ duration, y }}>
      <Icon
        inline={true}
        height="1.2em"
        class="absolute left-1/2 -mt-2 -translate-x-1/2 fill-current transition"
        icon={LightMode}
      />
    </div>
  {/if}
</button>
