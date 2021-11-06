const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        mono: 'VT323'
      },
      fontSize: {
        tiny: '0.7rem',
        xxs: '0.6rem'
      },
      animation: {
        'ping-slow': 'ping 3s ease infinite'
      },
      dropShadow: {
        text: '2px 2px 0 rgba(0, 0, 0, 0.9)'
      },
      colors: {
        orange: colors.orange,
        lime: colors.lime,
        gray: colors.coolGray
      }
    }
  },

  darkMode: 'class',
  plugins: []
};

module.exports = config;
