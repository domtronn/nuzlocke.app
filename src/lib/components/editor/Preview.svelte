<script>
  export let className, bosses, data
  import { fauxfetch } from '../../../routes/_fetch.js'

  import Pokemon from '$lib/components/pokemon-card.svelte'
  import TypeBadge from '$lib/components/type-badge.svelte'
  import Label from '$lib/components/label.svelte'

</script>

<div class='my-4 overflow-y-scroll preview {className}'>
  <div class='preview__grad preview__grad--top -mt-2' />

  <div id=capture class='grid grid-cols-2 gap-x-4 gap-y-8'>
    {#each Object.values(bosses) as boss (boss)}
      <div class='flex w-full gap-x-4 justify-between col-span-2'>
        <div class='flex items-center'>
          <h2>{boss?.name || ''}</h2>
          {#if boss.speciality}
            <TypeBadge type={boss.speciality} />
          {/if}
        </div>
        {#if boss.pokemon.length && boss.pokemon.some(i => +i.level >0)}
          <span class=-mb-6>
            <Label heading='Lvl cap' body={Math.max(... boss.pokemon.map(i => i.level || 0))} />
          </span>
        {/if}
      </div>

      {#each boss.pokemon as pokemon}
        {#if fauxfetch(pokemon, data)[1]}
          <Pokemon {...fauxfetch(pokemon, data)[1]} />
        {/if}
      {/each}
    {/each}
  </div>

  <div class='preview__grad preview__grad--bottom' />
</div>

<style>
  .preview {
    margin-top: -16px;
    position: relative;
    height: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  :global(.dark) .preview__grad--bottom {
    background: linear-gradient(transparent, theme('colors.gray.800') 50%);
  }
  :global(.dark) .preview__grad--top {
    background: linear-gradient(theme('colors.gray.800') 50%, transparent);
  }

  .preview__grad--top {
    top: 0;
    background: linear-gradient(white 50%, transparent);
  }
  .preview__grad--bottom {
    bottom: 0;
    background: linear-gradient(transparent, white 40%);
  }
  .preview__grad {
    transition: background 1s ease;
    width: 120%;
    position: sticky;
    left: 0;
    height: 24px;
    z-index: 60;
  }

  .preview::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    padding-left: 4px;
  }

  h2 { @apply text-2xl font-bold mr-2 }

  .preview::-webkit-scrollbar-thumb {
    transform: translateX(4px);
    border-radius: 8px;
    background-color: theme('colors.gray.200');
    box-shadow: theme('boxShadow.lg');
  }
</style>
