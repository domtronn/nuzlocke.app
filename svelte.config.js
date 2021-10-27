import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import preprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'

export default {
  kit: {
    adapter: vercel(),
    target: '#svelte',
    vite: {
      build: {
        target: ['es2020']
      }
    }
  },

  preprocess: preprocess({
    postcss: {
      plugins: [
        tailwind,
        autoprefixer
      ]
    }
  })
};
