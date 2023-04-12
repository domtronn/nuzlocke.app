import { building, dev } from '$app/environment';
const rewrite = !building && !dev;

// TODO: Remember to update `vercel.json` in root of project when
// modifying these sources

export const SPRITE = 'https://img.nuzlocke.app/sprites'
export const CUSTOM = 'https://img.nuzlocke.app/sprites'
export const IMG = 'https://img.nuzlocke.app'

export const DATA = rewrite
  ? 'https://img.nuzlocke.app/data'
  : '/api' // Load locally for development

export const QRCODE = rewrite
  ? '/assets/js/qrcode.min.js'
  : 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@gh-pages/qrcode.min.js';

export const INSTASCAN = rewrite
  ? '/assets/js/instascan.min.js'
  : 'https://cdn.jsdelivr.net/gh/schmich/instascan-builds@master/instascan.min.js';

export const UNOWN = rewrite
  ? '/assets/unown.png?v=1'
  : 'https://img.nuzlocke.app/assets/unown.png?v=1';

export const createImgUrl = (p, { ext = 'webp', shiny = false } = {}) => {
  if (!p) return UNOWN
  if (p.imgUrl) return `${CUSTOM}${p.imgUrl}.${ext}`

  const normalId = ('' + (p.imgId || p.sprite))
    .replace('.png', '')
    .replace('.webp', '')

  if (shiny) return `${SPRITE}/shiny/${normalId}.${ext}`
  return `${SPRITE}/base/${normalId}.${ext}`
}
