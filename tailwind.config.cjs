const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      dropShadow: {
        text: '2px 2px 0 rgba(0, 0, 0, 0.9)'
      },
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
