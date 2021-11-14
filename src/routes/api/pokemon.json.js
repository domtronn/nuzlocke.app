import { pick } from 'ramda'
import Pokemon from './pokemon'
import { mapObj } from '$lib/utils/arr'

export async function get ({ params, query }) {
  if (!query.get('p'))
    return { status: 404 }

  const plist = query.get('p').split(',')

  return {
    body: mapObj(
      pick(plist, Pokemon),
      d => ({
        ...pick(['num', 'baseStats', 'name', 'types'], d),
        imgId: d.num
      })
    ),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
