import { building, dev } from '$app/environment';
const rewrite = !building && !dev;

// TODO: Remember to update `vercel.json` in root of project when
// modifying these sources

export const SPRITE = 'https://img.nuzlocke.app/sprite';
export const CUSTOM = 'https://img.nuzlocke.app/sprites';

export const QRCODE = rewrite
  ? '/assets/js/qrcode.min.js'
  : 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@gh-pages/qrcode.min.js';

export const INSTASCAN = rewrite
  ? '/assets/js/instascan.min.js'
  : 'https://cdn.jsdelivr.net/gh/schmich/instascan-builds@master/instascan.min.js';

export const UNOWN = rewrite
  ? '/sprites/unown-qm'
  : 'https://img.pokemondb.net/sprites/home/normal/unown-qm.png';
