import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
import { filterObj } from '$lib/utils/arr'

export default filterObj(Pokemon, i => !i.forme || ['Galar', 'Alola'].includes(i.forme))
