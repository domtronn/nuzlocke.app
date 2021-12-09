<script>
  export let errors, value, className

  import Icon from 'svelte-icons-pack'
  import { Button, Tooltip } from '$lib/components/core'

  import { fade } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Success, Error, Copy, Camera } from './Icons'

  const animIn = { delay: 75, duration: 150 }
  const animOut = { duration: 150 }

  const dispatch = createEventDispatcher()

  const format = e => {
    const [msg, err] = e.split(':')
    return `<p><strong>${msg}:</strong> ${err}</p>`
  }

  const oncopy = _ => dispatch('copy')
  const onscreenshot = _ => dispatch('screenshot')

  $: hasErrors = errors.length
</script>

<div class='flex flex-col py-4 {className}'>
  <slot />
  <div
    class='shadow-xl rounded-2xl bg-gray-50 dark:bg-gray-900 relative editor'
    class:valid={errors.length === 0}
    >

    <textarea spellcheck=false bind:value />

    <div class=errors class:valid={!hasErrors} >

      {#if hasErrors}
        <h3 in:fade={animIn} out:fade={animOut}
            class='absolute bottom-3 right-5 font-bold text-base text-underline flex items-center'
            >
          {errors.length} Error{errors.length !== 1 ? 's' : ''}
          <Icon src={Error} className='fill-current ml-1' />
        </h3>
      {:else}
        <h3 in:fade={animIn} out:fade={animOut}
            class='font-bold text-base text-underline text-green-500 absolute bottom-3 right-4 flex items-center'
            >
          Valid
          <Icon size=1.4em src={Success} className='fill-current ml-1' />
        </h3>
      {/if}

      <div>
      {#each (errors || []) as e}
        {@html format(e)}
      {/each}
      </div>
    </div>
  </div>

  <span class='mt-4 flex gap-x-2'>
    <Button disabled={hasErrors} on:click={oncopy} className='umami--click--export w-full' rounded>
      <span class='inline-flex items-center font-medium'>
        <Icon size=1.2em src={Copy} className='fill-current mr-2 -ml-2'/>
        Copy to clipboard
      </span>
    </Button>

      <Button disabled on:click={onscreenshot} className='umami--click--screenshot w-full' rounded>
        <span class='inline-flex items-center font-medium -mb-1'>
        <Tooltip>Coming Soon. This feature isn't ready yet!</Tooltip>
          <Icon size=1.4em src={Camera} className='fill-current mr-2 translate-y-0.5 -ml-2'/>
          Take screenshot
        </span>
      </Button>
  </span>

</div>

<style>
  :root {
    --h: 50vh;
    --max-h: 60vh
  }

  textarea {
    @apply w-full rounded-t-2xl p-4 text-gray-900 text-sm bg-gray-50 overflow-scroll whitespace-nowrap z-10 border-0 outline-none transition;
    resize: none;
    height: var(--h);
  }

  :global(.dark) textarea {
    @apply text-gray-50 bg-gray-900 ;
  }

  .editor {
    @apply border-2 border-transparent outline-none hover:ring-0 transition hover:border-hotpink-400 hover:ring-hotpink-400 hover:focus-within:ring-2 focus-within:ring-2 focus-within:border-hotpink-500 focus-within:ring-hotpink-500
  }

  .editor.valid {
    @apply border-2 border-transparent outline-none hover:ring-0 transition hover:border-green-400 hover:ring-green-400 hover:focus-within:ring-2 focus-within:ring-2 focus-within:border-green-500 focus-within:ring-green-500
  }

  .errors * { direction: ltr; }
  .errors {
    direction: rtl;
    height: calc(var(--max-h) - var(--h));
    @apply transition p-4 leading-4 text-tiny text-hotpink-500 bg-hotpink-50 rounded-2xl z-0 border-gray-50 border-8 overflow-y-scroll overflow-x-hidden;
  }

  :global(.dark) .errors {
    @apply border-gray-900;
  }

  :global(.dark) .errors.valid {
    @apply bg-gray-900 border-transparent
  }

  .errors::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
  }

  .errors::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: theme('colors.hotpink.200');
    box-shadow: theme('boxShadow.lg');
  }

  .errors.valid {
    @apply bg-gray-50 border-transparent
  }
</style>
