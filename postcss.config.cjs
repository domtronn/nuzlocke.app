const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');
const cssnano = require('cssnano')

const config = {
  plugins: [tailwind(), autoprefixer(), cssnano()]
};

module.exports = config;
