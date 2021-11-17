import { capitalise } from '$lib/utils/string'

const natures = {
  bashful: [],
  docile: [],
  hardy: [],
  quirky: [],
  serious: [],
  adamant: ['atk', 'spa'],
  brave: ['atk', 'spe'],
  lonely: ['atk', 'def'],
  naughty: ['atk', 'spd'],
  bold: ['def', 'atk'],
  impish: ['def', 'spa'],
  lax: ['def', 'spd'],
  relaxed: ['def', 'spe'],
  modest: ['spa', 'atk'],
  mild: ['spa', 'def'],
  quiet: ['spa', 'spe'],
  quiet: ['spa', 'spd'],
  calm: ['spd', 'atk'],
  careful: ['spd', 'spa'],
  gentle: ['spd', 'def'],
  sassy: ['spd', 'spe'],
  hasty: ['spe', 'def'],
  jolly: ['spe', 'spa'],
  naive: ['spe', 'spd'],
  timid: ['spe', 'atk']
}

export default natures
export const Natures = Object
  .entries(natures)
  .map(([key, val]) => ({ id: key, label: capitalise(key), value: val }))

export const NaturesMap = Natures.reduce((acc, it) => ({ ...acc, [it.id]: it }), {})
