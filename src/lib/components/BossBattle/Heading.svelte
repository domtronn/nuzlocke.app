<script>
  import { FormalInvitation as Pattern } from '$lib/utils/pattern'
  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'

  import { IMG } from '$lib/utils/rewrites'

  export let atkType = null,
    defType = null,
    boss = null

  const rColDefault = '#cd4184',
    lColDefault = '#2f78df'

  const lCol = (tid) => (atkType ? color(atkType, tid) : lColDefault)
  const rCol = (tid) =>
    boss?.speciality ? color(boss?.speciality, tid) : rColDefault

  const center = 50

  let src
  $: src = boss?.img?.src ?? boss?.img
</script>

{#if boss?.img}
  <!-- <img class="absolute -top-8 left-8 -z-10 scale-y-150 -scale-x-150" src="/leaders/masters/trainer/red.png" /> -->
  <img class="absolute -top-7 right-8 -z-10 scale-200" src="{IMG}{src}.png" />
{/if}

<SettingWrapper id="theme" let:setting={themeId}>
  <div
    class="bbheading transition"
    style="background: linear-gradient(90deg, {lCol(themeId)} 0%, {lCol(
      themeId
    )} {center - 1}%, {rCol(themeId)} {center + 1}%, {rCol(themeId)});"
  >
    <div
      class="absolute inset-0 opacity-30 mix-blend-overlay"
      style="background-image: url('{Pattern('black')}')"
    />
  </div>

  <div
    class="anim-bg bbheading bbanim"
    style="background: linear-gradient(180deg, transparent 0%, white 48%, white 52%, transparent 100%);"
  />

  <div
    class="bbheading"
    style="background: linear-gradient(60deg, transparent 25%, var(--bbbgcol) {center -
      2}%, var(--bbbgcol) {center}%, var(--bbbgcol) {center +
      2}%, transparent 75%);"
  />

  <div
    class="absolute left-0 top-28 right-0 z-50 h-[2px] -translate-y-2.5"
    style="background: linear-gradient(90deg, {lCol(themeId)}, {rCol(
      themeId
    )});"
  />
</SettingWrapper>

<style>
  img {
    image-rendering: pixelated;
  }

  :root {
    --bbbgcol: white;
  }

  :global(.dark) {
    --bbbgcol: theme('colors.gray.900');
  }

  .bbheading {
    @apply absolute inset-0 top-6 h-20 w-full translate-y-2 rounded-t-lg;
  }

  .bbanim {
    animation: animVsPulse 6s ease infinite forwards;
  }

  @keyframes animVsPulse {
    0%,
    100% {
      opacity: 90%;
    }
    50% {
      opacity: 50%;
    }
  }
</style>
