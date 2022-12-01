import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: vercel()
  },

  preprocess: preprocess({
    postcss: true
  })
};
