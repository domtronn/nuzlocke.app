import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import preprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'

import { visualizer } from 'rollup-plugin-visualizer'

export default {
  kit: {
    adapter: vercel(),
    target: '#svelte',
    vite: {
      plugins: [
        visualizer()
      ],
      build: {
        sourcemap: true,
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
