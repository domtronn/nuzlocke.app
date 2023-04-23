<script>
  export let type

  import { PIcon, Tooltip } from '$c/core'
  import { Wrapper as SettingWrapper } from '$lib/components/Settings'

  import { capitalise } from '$lib/utils/string'
  import { color } from '$lib/data/colors.ts'
</script>

<SettingWrapper id="theme" let:setting={themeId}>
  <div
    style="background-color: {color(type, themeId)}"
    class="{$$restProps.class || ''} relative h-[32px] w-[32px] rounded-full"
  >
    <Tooltip>
      {#if $$slots.default}
        <slot />
      {:else}
        {capitalise(type)}
      {/if}
    </Tooltip>
    <PIcon class="ticon" type="symbol" name="type-{type}-32px" />
  </div>
</SettingWrapper>

<style>
  div :global(.ticon) {
    filter: brightness(200);
    @apply pointer-events-none absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-2.5;
  }
</style>
