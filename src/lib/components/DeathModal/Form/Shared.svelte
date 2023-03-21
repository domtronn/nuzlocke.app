<script>
  import { Input } from '$c/core'

  export let from, to
  
  export let fromPlaceholder = 'Capture level'
  export let toPlaceholder = 'Defeat level'
  
</script>

<slot name=label />

<div class='flex flex-col md:flex-row gap-2'>
  <Input
    bind:value={from}
    rounded
    min=1 max=100
    type=number
    name={fromPlaceholder}
    placeholder={fromPlaceholder}
  />

  <Input
    bind:value={to}
    min=1 max=100
    type=number
    rounded
    name={toPlaceholder}
    placeholder={toPlaceholder}
    />
</div>
