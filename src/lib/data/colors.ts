type THex = string

interface IPalette {
  normal: THex, fire: THex, water: THex, grass: THex, electric: THex,
  ice: THex, fighting: THex, poison: THex, ground: THex, flying: THex,
  fairy: THex, steel: THex, dragon: THex, dark: THex, ghost: THex,
  rock: THex, psychic: THex, bug: THex, '???': THex,
  special: [THex, THex],
  physical: [THex, THex],
  status: [THex, THex],
}

const palettes: Record<string, IPalette> = {
  default: {
    normal: '#a8a878', fire: '#ef8030', water: '#6890f0',
    grass: '#78c84f', electric: '#f9d030', ice: '#99d8d8',
    fighting: '#c03128', poison: '#a040a0', ground: '#e0c068',
    flying: '#a790f0', fairy: '#f0b6bc', steel: '#b8b8d0',
    dragon: '#7038f8', dark: '#6f5848', ghost: '#705898',
    rock: '#b7a039', psychic: '#f85888', bug: '#a8b820',
    '???': '#69a190', special: ['#5273ad', '#bbd1f1'], physical: ['#f85131', '#ffc631'], status: ['#ada594', '#ffffff']
  },

  legacy: {
    normal: '#ada594', fire: '#f65131', water: '#4652ed',
    grass: '#7ace52', electric: '#ffc631', ice: '#5bcde7',
    fighting: '#a45239', poison: '#b55aa5', ground: '#d6b55a',
    flying: '#9cacf7', fairy: '#ff64d5', steel: '#adadc6',
    dragon: '#7a63e3', dark: '#735a4a', ghost: '#6363b5',
    rock: '#bca55b', psychic: '#ff73a5', bug: '#adbd21', '???': '#69a190',

    special: ['#5273ad', '#bbd1f1'],
    physical: ['#f85131', '#ffc631'], status: ['#ada594', '#ffffff']
  },

  bright: {
    normal: '#a4abae', fire: '#fe7d24', water: '#4592c3',
    grass: '#9acd50', electric: '#efd535', ice: '#51c4e7',
    fighting: '#d46722', poison: '#ba7fc9', ground: '#f8df3f',
    flying: '#3bc7ee', fairy: '#fdb9ea', steel: '#9eb8b8',
    dragon: '#f16f58', dark: '#707070', ghost: '#7c61a2',
    rock: '#a28c20', psychic: '#f366b9', bug: '#719f3e', '???': '#69a190',
    special: ['#5273ad', '#bbd1f1'], physical: ['#f85131', '#ffc631'],
    status: ['#ada594', '#ffffff']
  },

  bold: {
    normal: '#c998a6', fire: '#fd4b5a', water: '#85a8fb',
    grass: '#26cb50', electric: '#fafa72', ice: '#d9f0fa',
    fighting: '#ef6239', poison: '#9b69da', ground: '#6e4a1f',
    flying: '#95b1c7', fairy: '#e91268', steel: '#44bc95',
    dragon: '#62cad9', dark: '#595978', ghost: '#906890',
    rock: '#8a3e22', psychic: '#f71b92', bug: '#3c9950', '???': '#69a190',
    special: ['#5273ad', '#bbd1f1'],
    physical: ['#f85131', '#ffc631'], status: ['#ada594', '#ffffff']
  },

  muted: {
    normal: '#929aa3', fire: '#ff9d53', water: '#4c91d7',
    grass: '#62bc5b', electric: '#f3d339', ice: '#74cfc1',
    fighting: '#ce3e6a', poison: '#ad6ac9', ground: '#da7844',
    flying: '#8faade', fairy: '#ed91e7', steel: '#598fa2',
    dragon: '#046ec5', dark: '#595167', ghost: '#5169ae',
    rock: '#c8b88c', psychic: '#f87177', bug: '#91c327', '???': '#69a190',
    special: ['#5273ad', '#bbd1f1'], physical: ['#f85131', '#ffc631'],
    status: ['#ada594', '#ffffff']
  }
}

export default palettes.default
export const Themes = palettes
export const Palettes = Object.values(palettes)
export const theme = (id: string) => palettes?.[id] || palettes.base

export const color = (val: string | string[], themeId: number): THex => Palettes?.[themeId || 0]?.[Array.isArray(val) ? val[0]?.toLowerCase() : val?.toLowerCase()]
