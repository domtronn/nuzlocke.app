const colors = require('tailwindcss/colors');

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

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
        'ping-slow': 'ping 3s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-2': 'spin 4s linear infinite',
        'full-pulse': 'full-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 3.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite',
        'shake-fast': 'shake 2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite',
      },
      dropShadow: {
        text: '2px 2px 0 rgba(0, 0, 0, 0.9)',
        grave: '1px 1px 0 rgba(0, 0, 0, 0.2)',
      },
      scale: {
        200: '2',
        250: '2.5'
      },
      colors: {
        orange: colors.orange,
        lime: colors.lime,
        gray: colors.neutral
      }
    }
  },

  darkMode: 'class',
  plugins: []
};

module.exports = config;
