<script>
  import Icon from 'svelte-icons-pack'
  import Info from 'svelte-icons-pack/bi/BiSolidHelpCircle'
</script>

<section>
  <div class=col-span-3>
    <h2 class='items-center inline-flex gap-x-4'><Icon src={Info} className=fill-current/>Help guide</h2>

    <p class='max-w-4xl pb-4'>
      This boss editor lets you build bosses, and teams. Use this guide
      to help you understand how to create them. If you make a mistake,
      errors will be shown to help you find incorrect spellings or
      names.
    </p>
  </div>
  <div>
    <h3> Boss format </h3>
    <p>
      To create a boss, you should add a new line starting with two dashes
      (<code class=d>--</code>) and add# the following information separated by
      a pipe (<code class=p>|</code>)
    </p>
    <ol class=list-decimal>
      <li>A unique <mark>identifier</mark>, e.g. <code>gym1</code></li>
      <li>The boss <mark>name</mark>, e.g. <code>Blaine</code></li>
      <li>An optional boss <mark>speciality</mark> e.g. <code>fire</code></li>
    </ol>
    
    <p>To create two gym leaders, Misty & Brock you would enter</p>
    <pre>
<span class=d>--</span>identifier<span>|</span>name<span>|</span>speciality
<span class=d>--</span>1<span>|</span>Brock<span>|</span>rock
<span class=d>--</span>2<span>|</span>Misty<span>|</span>water
    </pre>
  </div>
  
  <div class='grid grid-cols-2 col-span-2'>
    <h3 class=col-span-2>Team / Pokémon format</h3>
    <div>
      <p>
        To create a team you should add one line per Pokémon on with the following information separated by a pipe (<code class=p>|</code>)
      </p>

      <ol class=list-decimal>
        <li>
          <p>The <mark>name</mark> of the Pokémon in lower case, e.g. <code>pikachu</code></p>
          <p><strong>n.b.</strong> Alternate forms of Pokémon should be included in the name, e. g. <code>meowth-alola</code> or <code>meowth-galar</code>.</p> 
        </li>
        <li>The <mark>level</mark> of the Pokémon as a number, e.g. <code>25</code></li>
        <li>A list of <mark>moves</mark> separated by a comma (<code class=c>,</code>), e.g. <code>fire-blast<span class=c>,</span>drain-punch</code></li>
        <li>An <mark>ability</mark>, e.g. <code>intimidate</code></li>
        <li>A held <mark>item</mark>, e.g. <code>sitrus-berry</code></li>
        <li>
          <p>A required <mark>starter type</mark></p>
          <p>This makes the Pokémon only appear on the team when the user has selected a starter of that type</p>
          <p>i.e. <code>fire</code> should only appear if they chose Charmander etc.</p>
        </li>
      </ol>
      <p><strong class=-ml-9>n.b.</strong> Everything (name, moves, ability) should be kebab case and lower case i.e. <code>keen-eye</code> rather than <code>Keen Eye</code></p>
    </div>
    
    <div>
      <p>A few examples</p>
      
      <pre>
name<span>|</span>level<span>|</span>move-1<span class=c>,</span>move-2<span>|</span>ability<span>|</span>item<span>|</span>starter
pikachu<span>|</span>12<span>|</span>nuzzle<span class=c>,</span>quick-attack<span>|</span>static<span>|</span>light-clay
bulbasaur<span>|</span>5<span>|</span>scratch<span class=c>,</span> growl<span>|</span>overgrow<span>|</span><span>|</span>water
      </pre>

      <p>You can skip optional fields by leaving them empty, for example</p>

      <pre>
        pikachu<span>|</span><span>|</span>thunder-wave<span>|</span><span>|</span>light-clay
      </pre>

      <p>Will create a Pikachu without a level or ability with the one move Thunder Wave and holding Light Clay</p>
    </div>
  </div>
</section>

<style>
  h2 { @apply text-3xl font-bold -mb-2 }
  h3 { @apply text-xl font-bold -mb-2 }
  section {@apply text-gray-900 bg-white rounded-2xl grid grid-cols-3 pl-12 pr-6 py-8}

  :global(.dark) section { @apply bg-gray-800 text-gray-50 }
  section div { @apply mr-4 }
  
  ol, p {
    @apply my-4 leading-7
  }

  ol {
    @apply my-6
  }
  
  li { @apply my-2 }
  li p {
    @apply my-0
  }

  pre { @apply  bg-yellow-50 p-4 rounded-lg shadow-sm mr-6 }
  :global(.dark) pre { @apply bg-hotpink-50 }
  
  pre span, .p { @apply text-orange-400 }
  pre span.d, .d { @apply text-indigo-400 }
  pre span.c, span.c, .c { @apply text-green-400 }

  :global(.dark) .p { @apply text-orange-400 }
  :global(.dark) .d { @apply text-indigo-400 }
  :global(.dark) .c { @apply text-green-400 }

  code { @apply bg-gray-50 rounded-md px-2 py-0.5 shadow-sm }
  :global(.dark) code { @apply bg-gray-900 text-gray-50 }
  
  mark { @apply bg-yellow-100 px-1.5 py-0.5 }
  :global(.dark) mark { @apply bg-hotpink-100 px-1.5 py-0.5 }
  
  pre, code {
    @apply tracking-wide text-xl text-gray-800
  }
  
</style>
