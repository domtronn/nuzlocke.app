const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        lime: colors.lime
      }
    }
  },

  darkMode: 'media',
  plugins: []
};

module.exports = config;
