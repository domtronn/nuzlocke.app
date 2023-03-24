<script>
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
</script>

<svelte:window on:mousemove={oninteraction} />

<audio class='transform scale-75 mx-auto {$$restProps.class || ''}' bind:this={audio} controls autoplay loop id='audio'>
  <source {src}>
</audio>
