<script>
  export let delay = 0
</script>

<span
  style='--l-delay: {delay}s'
  class='flex items-center justify-center h-6 w-2px mx-2'
/>

<style>
  span::before,
  span::after {
    content: '';
    position: absolute;
    bottom: -5px;
    width: 4px;
    height: 4px;
    border-radius: 4px;
    animation: helix 1.25s ease-in-out infinite;
    animation-delay: var(--l-delay);
  }

  span::after {
    animation: helix-reversed 1.25s ease-in-out infinite;
    animation-delay: var(--l-delay);
  }

  span::before { background-color: theme('colors.blue.400'); }
  span::after { background-color: theme('colors.yellow.400'); }

  :global(.dark) span::before { background-color: theme('colors.gray.600'); }
  :global(.dark) span::after { background-color: theme('colors.gray.400'); }

</style>
