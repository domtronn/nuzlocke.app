import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import preprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'

import path from 'path'

// import { visualizer } from 'rollup-plugin-visualizer'

export default {
  kit: {
    adapter: vercel(),
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $c: path.resolve('./src/lib/components'),
          $utils: path.resolve('./src/lib/utils'),
          $data: path.resolve('./src/lib/data'),
          $store: path.resolve('./src/lib/store.js')
        }
      },
      plugins: [
        // visualizer()
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
