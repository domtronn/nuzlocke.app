<script>
  import { Tokens, format, randomTemplate } from './prose'
  import { IconButton, PIcon } from '$c/core'
  import { Dice } from '$icons'

  export let pokemon, nickname
  let ctx = {
    "type": "boss",
    "lvl": {
      "from": 12,
      "to": 24
    },
    "opponent": {
      "name": "Dewott",
      "types": [
        "water"
      ],
      "id": "dewott"
    },
    "location": {
      "name": "Driftveil Tournament Round 1"
    },
    "trainer": {
      "name": "Hugh",
      "id": "r3",
      "type": "rival"
    },
    "attack": {
      "name": "Aqua Jet",
      "type": "water"
    }
  }

  const onrandom = () => base = randomTemplate()
  const addtoken = (t) => (e) => {
    e.stopImmediatePropagation()
    e.preventDefault()
    base += ` ${t} `
    console.log('base', `"${base}"`)
    setTimeout(setCaret, 10)
  }

  const setCaret = () => {
    const range = document.createRange()
    const sel = window.getSelection()

    if (content === '') contentEditor.textContent = format(base, { ...ctx, nickname, pokemon })
    const [child] = contentEditor.childNodes

    if (child) {
      range.setStart(child, child?.textContent.length - 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }

    contentEditor.focus()
  }

  let base = randomTemplate(), contentEditor
  let previous, content
  $: {
    if (content === '')
      base = ''

    if (previous !== content && content !== "") {
      previous = content
      base = content
    }
  }

  $: contentEditor && (contentEditor.textContent = format(base, { ...ctx, nickname, pokemon }))
  const text = format(base, { ...ctx, nickname, pokemon })
</script>

<div class='text-base md:text-xl bg-gray-100 dark:bg-gray-800 px-2 py-3 md:px-4 md:py-6 md:pb-2 rounded-lg w-full text-center relative'>
  <PIcon
    className='grayscale transform scale-200 mb-3 -mt-3 pointer-events-none'
    name={pokemon.alias}
  />

  <br />

  <span
    class='min-w-[10ch] select-text border-transparent px-1 md:px-2 -ml-1 md:-ml-2 md:-mr-3 focus:text-black dark:focus:text-white focus:underline decoration-orange-300 dark:decoration-orange-400 underline-offset-4 outline-none'
    tabIndex='0'
    bind:this={contentEditor}
    bind:textContent={content}
    contenteditable
  >
    {text}
  </span>

  <IconButton
    rounded
    borderless
    color=orange
    src={Dice}
    tabIndex=-1
    on:click={onrandom}
    containerClassName='absolute bottom-0 right-0'
    title='Transfer save'
    />

<span class='flex gap-x-1 mt-4'>
  <button on:click={addtoken(Tokens.TPoke)}>
    + Name
  </button>
  <button on:click={addtoken(Tokens.OName)}>
    + Opponent
  </button>
  <button on:click={addtoken(Tokens.OPoke)}>
    + Pokemon
  </button>
  <button on:click={addtoken(Tokens.OAtk)}>
    + Attack
  </button>
</span>
</div>

<style>
  button {
    @apply text-xs rounded-full px-2 py-1
    hover:bg-gray-400 bg-gray-200 text-gray-800
;
  }

  :global(.dark) button {
    @apply hover:text-gray-200 hover:bg-gray-900 bg-gray-700 text-black
  }

</style>
