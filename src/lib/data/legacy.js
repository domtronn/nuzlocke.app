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

export const LegacyDamageClassMap = {
  "normal": "physical", "fighting": "physical", "flying": "physical", "poison": "physical", "ground": "physical", "rock": "physical", "bug": "physical", "ghost": "physical", "steel": "physical",
  "fire": "special", "water": "special", "grass": "special", "electric": "special", "psychic": "special", "ice": "special", "dragon": "special", "dark": "special",
}

const moves_pregen6 = {
  "charm": { type: 'normal' },
  "sweet-kiss": { type: 'normal' },
  "moonlight": { type: 'normal' },
}

const moves_pregen5 = {
  "curse": { type: '???' }
}

const moves_pregen2 = {
  "bite": { type: 'normal' }, 
  "gust": { type: 'normal' }, 
  "sand-attack": { type: 'normal' }, 
  "karate-chop": { type: 'normal' }, 
}

export const LegacyMoveMap = {
  pregen2: {
    ...moves_pregen6, 
    ...moves_pregen5, 
    ...moves_pregen2, 
  },
  pregen5: {
    ...moves_pregen6, 
    ...moves_pregen5, 
  },
  pregen6: {
    ...moves_pregen6, 
  }
}
