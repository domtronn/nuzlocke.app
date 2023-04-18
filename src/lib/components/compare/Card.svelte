<script>
  export let pokemon = [],
    className = ''

  import { fade } from 'svelte/transition'

  import { Icon, PIcon, Tooltip } from '$c/core'
  import { Hand, Ball, Loop as Badge } from '$icons'

  import { Wrapper as SettingWrapper } from '$lib/components/Settings'
  import { color } from '$lib/data/colors.ts'

  import { createImgUrl } from '$utils/rewrites'
  import { Stars as Pattern } from '$utils/pattern'

  $: atk = pokemon[0]
  $: def = pokemon[1]

  const sprite = (p, status) =>
    createImgUrl(
      { imgId: p?.original?.sprite ?? p.imgId },
      { ext: 'png', shiny: status === 6 }
    )
</script>

<SettingWrapper id="theme" let:setting={themeId}>
  <section
    in:fade|local
    class="relative shadow-lg dark:text-gray-50 {className}"
  >
    <!-- Pokemon face off -->
    <div
      class="relative -mt-8 flex h-24 flex-row justify-around overflow-hidden"
    >
      <!-- Colouring for types -->
      {#key `atk__${atk.name}`}
        <div
          in:fade={{ duration: 400, delay: 100 }}
          class="absolute bottom-0 top-0 left-0 mt-8 overflow-hidden rounded-tl-lg"
          style="width: 50%; background: {color(atk.types, themeId)};"
        >
          <div
            class="absolute inset-0"
            style={`background-image: url("${Pattern(
              color(atk.types[1] || atk.types[0], themeId)
            )}");`}
          />
        </div>
      {/key}

      {#key `def__${def.name}`}
        <div
          in:fade={{ duration: 400, delay: 100 }}
          class="absolute bottom-0 top-0 left-1/2 mt-8 overflow-hidden rounded-tr-lg"
          style="width: 50%; background: {color(def.types, themeId)};"
        >
          <div
            class="absolute inset-0"
            style={`background-image: url("${Pattern(
              color(def.types[1] || def.types[0], themeId)
            )}");`}
          />
        </div>
      {/key}
      <div
        class="divider absolute bottom-0 top-0 left-0 mt-8 rounded-t-lg"
        style="width: 100%;"
      />

      <!-- Images -->
      {#key `atk__${atk.name}`}
        <img
          alt={atk.name}
          in:fade={{ duration: 500 }}
          class="flip z-20 -mx-6 flex h-32 w-32"
          style="transform: scaleX(-1); "
          src={sprite(atk, atk.status)}
        />
      {/key}
      {#key `def__${def.name}`}
        <img
          alt={def.name}
          in:fade={{ duration: 500 }}
          class="z-20 -mx-6 flex h-32 w-32"
          src={sprite(def)}
        />
      {/key}

      {#if def?.original?.held}
        {#key def.original.held.name}
          <div
            style="transform: translate(var(--tw-translate-x),var(--tw-translate-y)) scaleX(-1)"
            class="absolute right-0 top-1/2 z-20 mb-1 flex -translate-y-3 -translate-x-5 cursor-help flex-col items-center p-1"
          >
            <Tooltip>
              {def.original.held.name}: {def.original.held.effect.replace(
                /^Held: +/g,
                ''
              )}
            </Tooltip>
            <span>
              <PIcon type="item" name={def.original.held.sprite} />
            </span>
            <Icon
              inline={true}
              icon={Hand}
              class="-mt-3.5 fill-current dark:text-white"
            />
          </div>
        {/key}
      {/if}

      <!-- VS Icon -->
      <div class="absolute left-1/2 bottom-1 h-8 w-8 -translate-x-1/2">
        <span class="flex">
          <Icon inline={true} class="absolute" height="1.4em" icon={Badge} />
          <Icon
            inline={true}
            class="absolute -top-0.5 right-2 rounded-full bg-white dark:bg-gray-800"
            height="0.8em"
            icon={Ball}
          />
          <Icon
            inline={true}
            class="absolute bottom-2 -left-0.5 rounded-full bg-white dark:bg-gray-800"
            height="0.8em"
            icon={Ball}
          />
        </span>
        <p class="absolute left-0.5 bottom-7 font-mono text-2xl">vs</p>
      </div>
    </div>

    <div
      class="separator w-full"
      style="background: linear-gradient(90deg, {color(
        atk.types,
        themeId
      )} 35%, {color(def.types, themeId)} 65%, {color(def.types, themeId)});"
    />

    <slot />
  </section>
</SettingWrapper>

<style lang="postcss">
  img.flip {
    animation: bob-left 4.5s ease 0.3s infinite;
  }
  img {
    animation: bob 5.5s ease 0.3s infinite;
    image-rendering: pixelated;
  }

  @keyframes bob {
    0%,
    100% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(1) scaleY(1);
    }
    25%,
    75% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(1.03) scaleY(0.97);
    }
    50% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(0.99) scaleY(1.03);
    }
  }

  @keyframes bob-left {
    0%,
    100% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-1) scaleY(1);
    }
    25%,
    75% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-1.02) scaleY(0.97);
    }
    50% {
      transform: translate(var(--tw-translate-x), var(--tw-translate-y))
        scaleX(-0.96) scaleY(1.01);
    }
  }

  .separator {
    height: theme('borderWidth.2');
  }
  :global(.dark) .divider {
    background: linear-gradient(
      30deg,
      transparent,
      theme('colors.gray.900') 40%,
      theme('colors.gray.900') 60%,
      transparent
    );
  }
  .divider {
    background: linear-gradient(
      30deg,
      transparent,
      theme('colors.white') 40%,
      theme('colors.white') 60%,
      transparent
    );
  }
</style>
