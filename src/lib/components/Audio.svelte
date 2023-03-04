<script>
  export let src

  let audio
  const play = _ => audio.play()
  const oninteraction = _ => play()
</script>

<svelte:window on:mousemove={oninteraction} />

<audio class='transform scale-75 mx-auto' bind:this={audio} controls autoplay loop id='audio'>
  <source {src}>
</audio>
