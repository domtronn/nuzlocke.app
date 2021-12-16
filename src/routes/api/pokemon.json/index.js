import Pokemon, { filterdata } from './_data.js'

export async function get () {
  return {
    body: filterdata(Pokemon),
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  }
}
