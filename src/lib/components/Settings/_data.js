import { toKebabCase } from '$lib/utils/string'

export const settingsDefault = '01110'
export const settingsData = [
  { name: 'Permadeath', help: 'Setting a Pokémon\'s status to Killed prevents you from changing the status ever again - if you get tempted'  },
  { name: 'Encounter suggestions', help: 'Show a prefiltered list of possible encounters for each location'},
  { name: 'Dupe Clause', help: 'How to handle duplicate encounters', options: [ 'Off', 'Highlight', 'Hide' ]},
  { name: 'Level Caps', help: 'Display max level caps on Boss Battles', options: [ 'Off', 'Gyms', 'Gym & Rival', 'Everything' ]},
  { name: 'Team Caps', help: 'Display team size restriction information on Gym Leader battles' },
].map((i, index) => ({ ...i, id: toKebabCase(i.name), index }))

const settingsMap = settingsData.reduce((acc, it, i) => ({ ...acc, [it.id]: it }), {})
export const getSetting = id => settingsMap[id].index
