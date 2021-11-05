<script>
  export let title, icon, className = ''
  import PixelatedContainer from '$lib/components/pixelated-container.svelte'
  import Icon from 'svelte-icons-pack'
</script>

<div class='container mx-auto my-12 sm:my-0 w-full md:h-screen flex flex-col justify-center'>
  <slot name='title' />
  <main class='w-full sm:w-auto px-6 flex flex-col mx-auto'>
    <PixelatedContainer className='px-4 py-2 flex flex-col gap-y-4 {className}'>
      {#if title}
        <span class='flex justify-between items-center gap-x-24'>
          <h1 class='text-2xl'>{title}</h1>
          {#if icon}
            <Icon src={icon} size='1.4em' />
          {/if}
        </span>
        <hr >
      {/if}
      <slot />
    </PixelatedContainer>
  </main>
</div>
