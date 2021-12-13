import { pick } from 'ramda'
import Pokemon from './_data.js'

const props = ['evos', 'evoline', 'types', 'name', 'sprite', 'label', 'alias', 'imgId', 'baseStats']
const items = Object
  .values(Pokemon)
  .map(p => ({
    ...pick(props, p),
    evos: p.evos.map(e => e.toLowerCase()),
    types: p.types.map(t => t.toLowerCase())
  }))

export async function get () {
  return {
    body: items,
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  }
}
