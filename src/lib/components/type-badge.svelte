<script>
  export let type, className = ''

  import Icon from 'svelte-icons-pack/Icon.svelte'
  import Special from 'svelte-icons-pack/fi/FiTarget'
  import Physical from 'svelte-icons-pack/fa/FaSolidFistRaised'
  import Status from 'svelte-icons-pack/bi/BiSolidYinYang'

  import ColorMap from '$lib/data/colors.json'
  const IconMap = {
    status: Status,
    physical: Physical,
    special: Special
  }

  const content = type.toUpperCase()
  const col = ColorMap[type.toLowerCase()]
  const icon = IconMap[type.toLowerCase()]
</script>

{#if icon}
  <div style="--badge-color: {col[0]}; padding: 4px 5px;" class={className}>
    <Icon src={icon} color={col[1]} />
  </div>
{:else if col}
  <div style="--badge-color: {col}; --badge-content: '{content}'" class={className}>
  {content}
</div>
{/if}

<style>
  :global(.dark) div { color: theme('colors.gray.900') }

  div {
    z-index: 2;
    position: relative;
    display: inline-flex;
    align-items: center;

    background-color: var(--badge-color);
    box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 3px, rgba(0, 0, 0, 0.16) 0px 1px 2px;

    color: white;
    font-family: 'VT323', monospace;
    font-size: 14px;
    letter-spacing: 2px;

    border-radius: 6px;
    padding: 1px 5px 1px 8px;
  }

  div::before {
    position: absolute;
    filter: blur(.5px);
    margin: .5px 0 0 1px;
    color: rgba(0, 0, 0, 0.3);
    content: var(--badge-content);
    z-index: -1;
  }
</style>
