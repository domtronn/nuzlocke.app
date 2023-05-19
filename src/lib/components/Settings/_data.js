import { toKebabCase, capitalise } from '$lib/utils/string'
import { Themes } from '$lib/data/colors.ts'

/**
  0 Permadeath
 */
export const settingsDefault = '01110100'

export const settingsData = [
  { index: 1, name: 'Encounter suggestions', help: 'Show a prefiltered list of possible encounters - You should turn this off for randomized runs' },
  { index: 5, name: 'Nickname Clause', help: 'Enable Nicknames for every encounter' },
  { index: 2, name: 'Dupe Clause', help: 'How to handle duplicate encounters', options: [ 'Off', 'Highlight', 'Hide' ]},
  { index: 6, name: 'Missed Dupes', help: 'Missing an encounter will mark that Pokémon as a duplicate' },
  { index: 3, name: 'Level Caps', help: 'Display max level caps on Boss Battles', options: [ 'Off', 'Gyms', 'Gym & Rival', 'Everything' ]},
  { index: 4, id: 'team-caps', name: 'Team Size Caps', help: 'Display team size restriction information for Gym Leader battles' },
  { index: 999, name: 'Greenscreen', help: 'Greenscreen to make editing screenshots easier. <span class="max-md:hidden"><kbd>Alt+Click</kbd> theme to quickly toggle this.</span>' },
  { index: 7, name: 'Theme', help: 'Select the Colour Theme for the Pokémon types', options: Object.keys(Themes).map(capitalise) },
  { index: 0, name: 'Permadeath', help: 'Setting a Pokémon\'s status to Killed prevents you from changing it' },
].map((i) => ({ ...i, id: i.id || toKebabCase(i.name) }))

const settingsMap = settingsData.reduce((acc, it, i) => ({ ...acc, [it.id]: it }), {})
export const getSetting = id => settingsMap[id].index
