<script>
  import { Input } from '$c/core'

  export let from, to
  
  export let fromPlaceholder = 'Capture level'
  export let toPlaceholder = 'Defeat level'
  
</script>

<slot name=label />

<div class='flex flex-row gap-2'>
  <Input
    className='flex-1'
    bind:value={from}
    rounded
    min=1 max=100
    type=number
    name={fromPlaceholder}
    placeholder={fromPlaceholder}
  />

  <Input
    className='flex-1'
    bind:value={to}
    min=1 max=100
    type=number
    rounded
    name={toPlaceholder}
    placeholder={toPlaceholder}
    />
</div>
