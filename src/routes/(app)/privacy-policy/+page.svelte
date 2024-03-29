<script context="module">
  export const prerender = true
</script>

<script>
  import { PixelatedContainer } from '$lib/components/containers'
  const clear = _ => {
    if (!confirm('This will delete all of your saved data and could degrade app performance. Are you sure you want to continue?'))
      return

    Object
      .keys(window.localStorage)
      .filter(i => i.startsWith('nuzlocke'))
      .forEach(it => window.localStorage.removeItem(it))

    // Clear all serviceworkers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister()
      } })

    alert('All data deleted successfully')
  }
</script>

<svelte:head>
  <title>Nuzlocke Tracker | Privacy Policy</title>
</svelte:head>

<main class='container mx-auto text-gray-800 pb-24 pt-8 sm:pt-0 dark:text-gray-300'>
  <div class='mx-auto pb-16 sm:pb-12 mx-4'>
    <PixelatedContainer className='my-16 py-6 px-8 overflow-x-hidden mx-auto max-w-prose'>
      <h1 class='text-2xl'>Privacy Policy</h1>
      <p class='text-xs -mt-px'>Last updated: November 7th, 2021</p>

      <p>
        No personal information is required to access or use the <b>Pokémon Nulocke Tracker</b>.
        We do not use any ad tracking
      </p>

      <p>
        We utilise
        the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"><strong>Window.localStorage</strong></a>
        browser API to store persistent data about Your save files and
        Pokémon. By using this site, You are agreeing to store this information
        in your browser.
      </p>

      <p>
        This information is never shared or analysed by Us or Third Parties
        and is not accessible beyond the use of the <b>Pokémon Nulocke
          Tracker</b>.
      </p>

      <p>
        The data stored is <strong>essential</strong> for site functionality, and is stored in under the following keys;
      </p>

      <table class='my-6 table-fixed overflow-x-scroll'>
        <thead class='border-b border-white'>
          <tr>
            <th> Key </th>
            <th> Purpose </th>
            <th> Example </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td><code>nuzlocke.consent</code></td>
          <td>Whether you have previously consented to data storage</td>
          <td><code>true</code></td>
        </tr>
        <tr>
          <td><code>nuzlocke</code></td>
          <td>The identifier for the current / active save file</td>
          <td><code>ccf2288e-fb30-4a80-960e-ef1be4f42018</code></td>
        </tr>
        <tr>
          <td><code>nuzlocke.theme</code></td>
          <td>Your preference for a Dark or Light theme</td>
          <td><code>dark</code></td>
        </tr>
        <tr>
          <td><code>nuzlocke.saves</code></td>
          <td>A pipe and comma separated list of saved games</td>
          <td><code>id|timestamp|name|gameId</code></td>
        </tr>
        <tr>
          <td><code>nuzlocke.[GAMEID]</code></td>
          <td>A JSON representation of your Pokémon & Starter type</td>
          <td><code>{JSON.stringify({"__starter":"fire", "Route 1":{"id":0,"pokemon":"charmander", "status":1}})}</code></td>
        </tr>
        </tbody>
      </table>

      <p>
        You can clear all your stored data by <button on:click={clear} class='hover:cursor-pointer underline' title='Clear all stored data'>Clicking Here</button>.
      </p>

      <h2 class='text-xl mb-2'>Changes to this Privacy Policy</h2>
      <p>
        We may update Our Privacy Policy from time to time. We will notify
        You of any changes by posting the new Privacy Policy on this page.
      </p>

      <p>
        You are advised to review this Privacy Policy periodically for any
        changes. Changes to this Privacy Policy are effective when they are
        posted on this page.
      </p>

      <h2 class='text-xl mb-2'>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, You can contact us:
      </p>
      <ul>
        <li>By email: <a class="hover:text-white transition-colors" href="mailto:nuzlocke.tracker@gmail.com">nuzlocke.tracker@gmail.com</a></li>
      </ul>
    </PixelatedContainer>
  </div>
</main>

<style lang="postcss">
  td + td + td,
  th + th + th { display: none; }
  @media (min-width: 640px) {
    td + td + td,
    th + th + th { display: block; }
  }

  p { margin-bottom: 16px; }
  tr, thead { font-size: .75rem; }
  thead { text-align: left; }
  tr code { font-size: 1rem; }
  a { text-decoration: underline; transition: all 0.3s ease; }
  a:hover { color: white; }
</style>
