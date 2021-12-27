<script>
  import { onMount } from 'svelte'
  import { random } from '$lib/utils/arr'
  import deferStyles from '$lib/utils/defer-styles'

  import Drop from './RainDrop.svelte'
  import { PIcon } from '$lib/components/core'

  export let icons, className = '', amount = 25, height = 128, width = 128, scale = _ => 1 + Math.random() / 3
  const particles = [...Array(amount)]
    .map(() => {
      const initY = -(Math.random() * height * 2) - 20
      const initX = (Math.random() * width)
      return {
        icon: random(icons),
        scale: scale(),
        v: 0,
        theta: 0,
        y: initY,
        x: initX,
        initY, initX
      }})

  onMount(() =>
    deferStyles(`/assets/items.css?i=${icons.join(',')}`))
</script>

{#each particles as p}
  <Drop {...p} {className} {width} {height}>
    <PIcon name={p.icon}  type=item />
  </Drop>
{/each}
