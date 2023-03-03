<script>
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';
  import { Coffee } from '$icons'
  import { GitHub } from '$icons'
  import { Discord } from '$icons'
  import { Heart } from '$icons'
</script>

<footer>
  <p>
    <a href="https://www.buymeacoffee.com/nuzlocketracker"
       rel=noreferrer target=_blank>
      <button aria-label='Support me' title='Supprt me'>
        <Icon inline={true} class='fill-current' icon={Coffee} />
      </button>
    </a>

    <a href="https://github.com/domtronn/dc-nuzlocke/issues/new?assignees=&labels=&template=bug_report.md&title="
       rel=noreferrer target=_blank>
      <button aria-label='Report bugs' title='Report bugs'>
        <Icon inline={true} class='fill-current' icon={GitHub} />
      </button>
    </a>

    <a href="https://discord.gg/gtdceegtYB"
       rel=noreferrer target=_blank>
      <button aria-label='Discuss & follow new features' title='Discuss & follow new features'>
        <Icon inline={true} class=' fill-current' icon={Discord} />
      </button>
    </a>

  </p>


  <span class='inline-flex items-center mb-2'>Made with <Icon inline={true} icon={Heart} class='mx-1 fill-current text-red-500' /> by<strong class=ml-1>Domtronn</strong></span>
  <br />
  All content & design © Pokémon Nuzlocke Tracker, 2021-{(new Date()).getFullYear()}. <a href='/privacy-policy'>Privacy Policy</a>. <a href='/credit'>Credits</a>.
  <br class='hidden md:block' />
  Pokémon images & names © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM
</footer>

<!-- svelte-ignore css-unused-selector -->
<style>
  footer { @apply text-center w-full absolute bottom-0 my-4 sm:my-6 px-4 text-tiny md:text-xs text-gray-500 dark:text-gray-400 leading-3; }
  footer > p { @apply flex justify-center text-2xl gap-x-2; }
  footer a,
  footer button { @apply transition-colors dark:hover:text-white hover:text-black; }
  footer button { @apply p-3 }
</style>
