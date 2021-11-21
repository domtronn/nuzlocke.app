<script>
  /* eslint-disable */
  import 'pokemon-assets/assets/css/pokemon.css'
  import Pokemon from 'pokemon-assets/assets/data/pokemon.json'

  import PIcon from '$lib/components/core/PokemonIcon.svelte'
  import ParticleIcon from '$lib/components/core/ParticleIcon.svelte'
  import ProgressBar from '$lib/components/ProgressBar.svelte'

  import Input from '$lib/components/core/Input.svelte'
  import IconButton from '$lib/components/core/IconButton.svelte'
  import Button from '$lib/components/core/Button.svelte'
  import AutoComplete from '$lib/components/core/AutoComplete.svelte'

  import Loader from '$lib/components/core/Loader/Loader.svelte'

  let placeholder = 'Nickname'
  let value, selected

  import natures from '$lib/data/natures'
  import StatBlock from '$lib/components/stat-block.svelte'

  const fetch = () => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(Object.values(Pokemon)), 5)
  })

  const items = [
    { "pid": "sw", "lid": "swsh", "logo": "/logos/sword-logo.webp", "title": "Sword", "gen": "VIII", "supported": true  },
    { "pid": "sh", "lid": "swsh", "logo": "/logos/shield-logo.webp", "title": "Shield", "gen": "VIII", "supported": true  },
    { "pid": "usun", "lid": "usum", "logo": "/logos/ultra-sun-logo.webp", "title": "Ultra Sun", "gen": "VII", "supported": false  },
    { "pid": "umoon", "lid": "usum", "logo": "/logos/ultra-moon-logo.webp", "title": "Ultra Moon", "gen": "VII", "supported": false  },
    { "pid": "sm", "lid": "sm", "logo": "/logos/sun-logo.webp", "title": "Sun", "gen": "VII", "supported": false  },
    { "pid": "moon", "lid": "sm", "logo": "/logos/moon-logo.webp", "title": "Moon", "gen": "VII", "supported": false  },
    { "pid": "xy", "logo": "/logos/x-logo.webp", "title": "X", "gen": "VI", "supported": true },
  ]

  let segments = [
    { type: 'elite-four', value: true },
    { type: 'elite-four', value: true },
    { type: 'elite-four', value: true },
    { type: 'elite-four', value: false },
    { type: 'gym-leader', value: true },
    { type: 'gym-leader', value: true },
    { type: 'gym-leader', value: false },
    { type: 'gym-leader', value: false },
    { type: 'gym-leader', value: true },
    { type: 'gym-leader', value: true },
    { type: 'gym-leader', value: false },
    { type: 'gym-leader', value: false },
    { type: 'rival', value: true },
    { type: 'rival', value: false },
    { type: 'rival', value: false },
    { type: 'rival', value: false },
    { type: 'rival', value: false },
  ]

  const update = _ => segments = segments.map(i => ({ ...i, value: !i.value }))

</script>

<svelte:head>
  <link rel=stylesheet href=/assets/items.css />
  <link rel=stylesheet href=/assets/badges.css />
  <link rel="stylesheet" type="text/css" href="https://csshake.surge.sh/csshake.min.css">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</svelte:head>

<main class='flex flex-col h-screen justify-center items-center'>
  <div class='mx-auto w-full sm:w-1/2 px-6'>

    <!-- amulet coin big nugget gold bottle cap -->

    <ProgressBar {segments} />

    <span on:click={update}>
    <ParticleIcon type=item icons={['nugget', 'gold-bottle-cap', 'amulet-coin', 'relic-gold']}>
      <PIcon type=b name=plain className='grayscale hover:grayscale-0 transition' />
    </ParticleIcon>
    </span>

    <StatBlock
      nature={natures.jolly}
      hp={95}
      max={255}
      atk={120}
      def={150}
      spa={55}
      spd={75}
      spe={90}
    />

    <form class='grid grid-cols-8 w-full gap-x-4'>
      <Input
        rounded
        className=col-span-3
        placeholder=Nickname
        bind:value={value}
      />

      <AutoComplete
        rounded
        className=col-span-3
        placeholder=Encounter
        label=title

        inset={!!selected}
        bind:selected={selected}
        {items}
      >
        <span class='flex items-center h-8' slot=item let:item let:label>
          <PIcon name={item.sprite} className='transform scale-75 -mb-4 -ml-6 -mt-5 -mr-2' />
          {@html label}
        </span>

        <svelte:fragment slot=icon let:iconClass>
          {#if selected}
            <PIcon name={selected.sprite} className={iconClass} />
          {/if}
        </svelte:fragment>
      </AutoComplete>

      <IconButton rounded name=poke-ball color=orange class=col-span-1 />
    </form>

    <Button rounded className='w-full'>
      Create game
    </Button>

  </div>

</main>
