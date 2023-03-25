<script>
  import { onMount } from 'svelte'
  export let src

  let audio
  let played = false

  const oninteraction = async _ => {
    if (played) return
    try {
      await audio.play()
      played = true
    } catch (e) {}
  }

  onMount(() => {
    document.getElementById('audio-player').volume = 0.0075
  })

</script>

<svelte:window on:mousemove={oninteraction} />

<audio class='transform scale-75 mx-auto {$$restProps.class || ''}' bind:this={audio} controls autoplay loop id=audio-player>
  <source {src}>
</audio>
