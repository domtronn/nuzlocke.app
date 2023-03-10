export const types = [
  'normal', 'fire', 'water',
  'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'fairy', 'steel',
  'dragon', 'dark', 'ghost', 'rock', 'psychic', 'bug'
]

const pregen6 = {
  azumarill: { types: ['water'] },
  azurill: { types: ['water'] },
  clefable: { types: ['normal'] },
  clefairy: { types: ['normal'] },
  cleffa: { types: ['normal'] },
  cottonee: { types: ['grass'] },
  gardevoir: { types: ['psychic'] },
  granbull: { types: ['normal'] },
  igglybuff: { types: ['normal'] },
  jigglypuff: { types: ['normal'] },
  kirlia: { types: ['psychic'] },
  marill: { types: ['water'] },
  mawile: { types: ['steel'] },
  'mime-jr': { types: ['psychic'] },
  'mr-mime': { types: ['psychic'] },
  ralts: { types: ['psychic'] },
  snubbull: { types: ['normal'] },
  togekiss: { types: ['normal', 'flying'] },
  togepi: { types: ['normal'] },
  togetic: { types: ['normal', 'flying'] },
  whimsicott: { types: ['grass'] },
  wigglytuff: { types: ['normal'] },
}

const pregen2 = {
  ...pregen6,
  magnemite: { types: ['electric'] },
  magneton: { types: ['electric'] },
}

export const LegacyTypeMap = {
  pregen6, pregen2
}
