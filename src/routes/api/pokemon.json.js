import { pick } from 'ramda'
import Pokemon from './pokemon'
import { mapObj } from '$lib/utils/arr'

const FormMap = {
  rattataalola: 10091,
  raticatealola: 10092,
  raichualola: 10100,
  sandshrewalola: 10101,
  sandslashalola: 10102,
  vulpixalola: 10103,
  ninetalesalola: 10104,
  diglettalola: 10105,
  dugtrioalola: 10106,
  meowthalola: 10107,
  persianalola: 10108,
  geodudealola: 10109,
  graveleralola: 10110,
  golemalola: 10111,
  grimeralola: 10112,
  mukalola: 10113,
  exeggutoralola: 10114,
  marowakalola: 10115,
  meowthgalar: 10158,
  ponytagalar: 10159,
  rapidashgalar: 10160,
  slowpokegalar: 10161,
  slowbrogalar: 10162,
  farfetchdgalar: 10163,
  weezinggalar: 10164,
  mrmimegalar: 10165,
  articunogalar: 10166,
  zapdosgalar: 10167,
  moltresgalar: 10168,
  slowkinggalar: 10169,
  corsolagalar: 10170,
  zigzagoongalar: 10171,
  linoonegalar: 10172,
  darumakagalar: 10173,
  yamaskgalar: 10176,
  stunfiskgalar: 10177
}

export async function get ({ params, query }) {
  if (!query.has('p'))
    return { body: {} }

  const plist = query.get('p').split(',')

  return {
    body: mapObj(
      pick(plist, Pokemon),
      d => ({
        ...pick(['num', 'baseStats', 'name', 'types'], d),
        imgId: FormMap[d.alias] || d.num
      })
    ),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
