<script>
  export let team

  import { dev } from '$app/env'

  import Versus from './Versus.svelte'
  import { Loader } from '$lib/components/core'
  import { getContext } from 'svelte'
  import { getBox } from '$lib/store'

  import { PIcon } from '$lib/components/core'

  const { getPkmns } = getContext('game')
  const { close } = getContext('simple-modal')

  let box
  getBox(b => getPkmns(b.map(i => i.pokemon))
         .then(data => box = Object.values(data)))

  const fetchadvice = (team, box) =>
    fetch('/api/battle/advice.json', {
      method: 'POST',
      body: JSON.stringify({ team, box, debug: dev }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
</script>

<div class='p-8 bg-gray-800 rounded-lg'>
  {#if Array.isArray(box)}
    {#await fetchadvice(team, box)}
      <Loader />
    {:then advice}
      <div class='grid sm:grid-cols-2'>
        <ul>
          {#if advice.great?.length}
            <li>
              <Versus def={advice.great} />
            </li>
          {/if}

          {#if advice.okay}
            <li>
              <Versus def={advice.okay} />
            </li>
          {/if}

          {#each Object.entries(advice.team) as [atk, { great, okay }]}
            {#if great?.length}
              <li class='inline-flex flex-wrap gap-x-2 dark:text-gray-200'>
                <p>All of {atk}'s attacks are not very effective against</p>
                <Versus {atk} def={great} />
              </li>
            {/if}
            
            {#if okay?.length}
              <p>Most of of {atk}'s attacks are not very effective against</p>
              <li class='inline-flex items-center gap-x-2 dark:text-gray-200'>
                <Versus {atk} def={okay} />
              </li>
            {/if}
          {/each}
        </ul>
        <ul>
        </ul>
      </div>
    {/await}
  {/if}
</div>
