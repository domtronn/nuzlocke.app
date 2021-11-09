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
        tiny: '12px',
        xxs: '16px'
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
        gray: colors.trueGray
      }
    }
  },

  darkMode: 'class',
  plugins: []
};

module.exports = config;
