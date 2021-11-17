import { pick } from 'ramda'
import Pokemon from './index.js'

const items = Object
  .values(Pokemon)
  .map(pick(['name', 'sprite', 'label', 'alias']))

export async function get ({ params }) {
  return {
    body: items,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Content-Type': 'application/json'
    }
  }
}
