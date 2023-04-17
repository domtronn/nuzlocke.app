<script>
  export let type,
    tera,
    className = ''

  if (tera) className = (className + ' tera').trim()

  import { Icon } from '$c/core'
  import { Special, Physical, Status } from '$icons'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'
  const IconMap = {
    status: Status,
    physical: Physical,
    special: Special
  }

  const content = type.toUpperCase()
  const icon = IconMap[type.toLowerCase()]
</script>

<SettingWrapper id="theme" let:setting={themeId}>
  {#if icon}
    <div
      style="--badge-color: {color(type, themeId)[0]}; padding: 4px {type ===
      'physical'
        ? 6.5
        : 5}px;"
      class={className}
    >
      <Icon inline={true} {icon} color={color(type, themeId)[1]} />
    </div>
  {:else if $$slots.content}
    <div style="--badge-color: {color(type, themeId)};" class={className}>
      <slot name="content" />
    </div>
  {:else}
    <div
      style="--badge-color: {color(
        type,
        themeId
      )}; --badge-content: '{content}'"
      class={className}
    >
      {#if tera} <span /> <span /> <span /> <span /> <span /> <span /> {/if}
      {content}
    </div>
  {/if}
</SettingWrapper>

<style lang="postcss">
  :global(.dark) div {
    color: theme('colors.gray.900');
  }

  span {
    z-index: -1;
    position: absolute;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;

    border-bottom: 5px solid;
    border-bottom-color: var(--badge-color);
  }

  span:nth-child(2),
  span:nth-child(5) {
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 3px solid;
    border-bottom-color: var(--badge-color);
  }

  span:nth-child(1) {
    top: -2px;
    left: -3px;
    transform: rotate(-40deg);
  }
  span:nth-child(2) {
    left: -10px;
    top: 50%;
    transform: rotate(-90deg) translateX(2px);
  }
  span:nth-child(3) {
    bottom: -2px;
    left: -3px;
    transform: rotate(-140deg);
  }
  span:nth-child(4) {
    top: -2px;
    right: -3px;
    transform: rotate(40deg);
  }
  span:nth-child(5) {
    right: -10px;
    top: 50%;
    transform: rotate(90deg) translateX(-2px);
  }
  span:nth-child(6) {
    bottom: -2px;
    right: -3px;
    transform: rotate(140deg);
  }

  div.tera {
    text-align: center;
    position: relative;
    margin: 0 2px;
    padding: 0 16px;

    border-radius: 0;

    background-image: url('https://img.nuzlocke.app/assets/crystal.webp');
    background-size: cover;
    background-position: center;
    background-blend-mode: luminosity;
    box-shadow: rgba(255, 255, 255, 0.08) 0px 1px 3px,
      rgba(255, 255, 255, 0.16) 0px 1px 2px;
  }

  div.tera::before {
    color: white;
  }

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
    filter: blur(0.5px);
    margin: 0.5px 0 0 1px;
    color: rgba(0, 0, 0, 0.3);
    content: var(--badge-content);
    z-index: -1;
  }
</style>
