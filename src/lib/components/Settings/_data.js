import { toKebabCase } from '$lib/utils/string'

export const settingsDefault = '011101'
export const settingsData = [
  { index: 1, name: 'Encounter suggestions', help: 'Show a prefiltered list of possible encounters - You should turn this off for randomized runs' },
  { index: 5, name: 'Nickname Clause', help: 'Enable Nicknames for every encounter' },
  { index: 2, name: 'Dupe Clause', help: 'How to handle duplicate encounters', options: [ 'Off', 'Highlight', 'Hide' ]},
  { index: 3, name: 'Level Caps', help: 'Display max level caps on Boss Battles', options: [ 'Off', 'Gyms', 'Gym & Rival', 'Everything' ]},
  { index: 4, id: 'team-caps', name: 'Team Size Caps', help: 'Display team size restriction information for Gym Leader battles' },
  { index: 0, name: 'Permadeath', help: 'Setting a Pokémon\'s status to Killed prevents you from changing the status ever again'  },
].map((i) => ({ ...i, id: i.id || toKebabCase(i.name) }))

const settingsMap = settingsData.reduce((acc, it, i) => ({ ...acc, [it.id]: it }), {})
export const getSetting = id => settingsMap[id].index
