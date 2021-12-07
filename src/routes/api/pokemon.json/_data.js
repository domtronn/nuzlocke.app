import Pokemon from 'pokemon-assets/assets/data/pokemon.json'
import { filterObj, mapObj } from '$lib/utils/arr'
import { pick } from 'ramda'

const FormMap = {
  rattataalola: 10091, raticatealola: 10092, raichualola: 10100,
  sandshrewalola: 10101, sandslashalola: 10102, vulpixalola: 10103,
  ninetalesalola: 10104, diglettalola: 10105, dugtrioalola: 10106,
  meowthalola: 10107, persianalola: 10108, geodudealola: 10109,
  graveleralola: 10110, golemalola: 10111, grimeralola: 10112,
  mukalola: 10113, exeggutoralola: 10114, marowakalola: 10115,
  meowthgalar: 10158, ponytagalar: 10159, rapidashgalar: 10160,
  slowpokegalar: 10161, slowbrogalar: 10162, farfetchdgalar: 10163,
  weezinggalar: 10164, mrmimegalar: 10165, articunogalar: 10166,
  zapdosgalar: 10167, moltresgalar: 10168, slowkinggalar: 10169,
  corsolagalar: 10170, zigzagoongalar: 10171, linoonegalar: 10172,
  darumakagalar: 10173, yamaskgalar: 10176, stunfiskgalar: 10177, darmanitangalar: 10174
}

export const format = ({ name, forme }) => {
  if (forme === 'Galar') return `Galarian ${name.replace(/-Galar/g, '')}`
  if (forme === 'Alola') return `Alolan ${name.replace(/-Alola/g, '')}`
  return name
}

export default mapObj(
  filterObj(
    Pokemon,
    pkmn => !pkmn.forme || ['Galar', 'Alola'].includes(pkmn.forme)
  ),
  pkmn => ({
    ...pkmn,
    imgId: FormMap[pkmn.alias] || pkmn.num,
    label: format(pkmn)
  })
)

const props = ['evos', 'types', 'name', 'sprite', 'label', 'alias', 'imgId', 'baseStats']
export const filterdata = o => Object
  .values(o)
  .map((p) => ({
    ...pick(props, p),
    evos: p.evos.map(e => e.toLowerCase()),
    types: p.types.map(t => t.toLowerCase())
  }))
