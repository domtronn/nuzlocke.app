import { pick } from 'ramda'
import Pokemon from './index.js'

const props = ['evos', 'types', 'name', 'sprite', 'label', 'alias', 'imgId', 'baseStats']
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
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'application/json'
    }
  }
}
