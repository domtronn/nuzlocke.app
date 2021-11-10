<script>
  export let title, icon, containerClassName = '', className = ''
  import { PixelatedContainer } from '$lib/components/containers'
  import Icon from 'svelte-icons-pack'
</script>

<div class='container mx-auto sm:my-0 w-full flex flex-col justify-center {containerClassName}'>
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

<style>
  div { height: calc(100vh - 72px); }
</style>
