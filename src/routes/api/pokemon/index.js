import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
import { filterObj, mapObj } from '$lib/utils/arr'

export const format = ({ name, forme }) => {
  if (forme === 'Galar') return `Galarian ${name.replace(/-Galar/g, '')}`
  if (forme === 'Alola') return `Alolan ${name.replace(/-Alola/g, '')}`
  return name
}

export default mapObj(filterObj(Pokemon, i => !i.forme || ['Galar', 'Alola'].includes(i.forme)), i => ({ ...i, label: format(i) }))
