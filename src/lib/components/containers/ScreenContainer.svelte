<script>
  export let title, icon, containerClassName = '', className = ''
  import { PixelatedContainer } from '$lib/components/containers'
  import Icon from 'svelte-icons-pack'
</script>

<div class='container mx-auto mt-32 sm:mt-16 w-full flex flex-col justify-center {containerClassName}'>
  <slot name='title' />
  <main class='w-full sm:w-auto px-6 flex flex-col mx-auto'>
    <PixelatedContainer className='px-4 py-2 flex flex-col gap-y-4 {className}'>
      {#if title}
        <span class='flex justify-between items-center md:gap-x-24'>
          <h1 class='text-xl md:text-2xl font-bold'>{title}</h1>
          {#if icon}
            <Icon src={icon} size='1.2em' className='fill-current' />
          {/if}
        </span>
        <hr >
      {/if}
      <slot />
    </PixelatedContainer>
  </main>
</div>
