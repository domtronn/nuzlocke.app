import Pokemon, { filterdata } from './_data.js'
const items = filterdata(Pokemon)

export async function get () {
  return {
    body: items,
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  }
}
