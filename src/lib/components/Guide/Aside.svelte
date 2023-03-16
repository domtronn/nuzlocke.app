<script>
  export let encounters, gyms, path
  import { toSlug, toId, capitalise } from '$utils/string'

  import { PIcon } from '$c/core'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { Chevron } from '$icons'

  const splitAt = (arr, i) => [arr.slice(0, i), arr.slice(i)]

  const bossOrder = ['Gym Leader', 'Elite Four', 'Rival', 'Evil Team', 'Mini Boss', 'Other'].filter(i => gyms[i])

  let show = false
  const onshow = _ => show = !show
</script>

<aside class:show class=g-container>
  <button class='head w-full' on:click={onshow}>
    <h2>In this guide</h2>

    <Icon inline={true} icon={Chevron} class=fill-current height=2rem />
  </button>

  <div class=main>
    <div class=encounters>
      <h3>
        <a href='{path}#encounters'>Encounters</a>
      </h3>
      <ul>
        {#each Object.keys(encounters) as type}
          <li>
            <a href='{path}#{toId.encounter(type)}'>
              <PIcon type=symbol className=icon name='type-{type.toLowerCase()}-badge-32px' />
              {capitalise(type)} Encounters
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div class=boss>
      <h3>
        <a href='{path}#boss-summary'>Boss battles</a>
      </h3>
    </div>

    {#each splitAt(bossOrder, 2) as groups}
      <div class=boss-group>
        {#each groups as group}
          <h4>
            <a href='{path}#{toSlug(group)}'>{group} fights</a>
          </h4>

          <ul>
            {#each gyms[group] as { boss, name }}
              <li>
                <a href='{path}#{toId.boss(boss, name)}'>{boss} at {name}</a>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    {/each}
  </div>

</aside>

<style lang="postcss">
 h3 { @apply text-xl }

 ul { @apply divide-y }
 :global(.dark) ul {
   @apply divide-gray-600
 }

 li a { @apply flex py-2 text-sm text-gray-500 font-medium }

 li a :global(.icon) {
   @apply -m-4 -mr-2;
 }

 li:hover a {
   @apply pl-4 bg-gray-50;
   color: #4434ff;
 }

 :global(.dark) li a {
   @apply text-gray-200 font-light;
 }

 :global(.dark) li:hover a {
   @apply bg-gray-700 text-white;
 }

 h3:hover {
   color: #4434ff;
 }

 li, a {
   transition: all 0.2s ease;
   @apply pl-0 w-full inline-flex items-center
 }

 h2, h3 {
   transition: all 0.1s ease !important;
   @apply my-4 font-bold flex
 }

 * { @apply tracking-widest }

 .main { @apply grid gap-x-10 md:grid-cols-3 }
 .main {
   max-height: 0;
   @apply overflow-hidden;
 }


 .head h2 + :global(*) { @apply rotate-90; }
 .show .head h2 + :global(*) { @apply rotate-180; }

 .main, .head, .head h2 +:global(*)
 {
   transition: all 0.3s ease;
 }

 .main {
   @apply border-b -mt-px
 }

 :global(.dark) .main,
 :global(.dark) .head
 {
   @apply border-gray-600
 }

 .show .main {
   max-height: 9999px;
 }

 @media (min-width:theme('screens.sm')) {
   .show .main {
     max-height: 1000px;
   }
 }

 .head { @apply col-span-3 flex items-center justify-between cursor-pointer w-full ring-2 ring-transparent my-2; }
 .head:hover {
   @apply ring-yellow-500;
 }

 .encounters { @apply col-span-2 md:col-span-1 row-span-4 }

 .boss { @apply col-span-2 }
 .boss-group { @apply col-span-2 md:col-span-1 }

 aside { @apply mt-4 md:mt-16 }
</style>
