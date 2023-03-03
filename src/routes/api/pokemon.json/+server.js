import Pokemon, { filterdata } from './_data.js';
const items = filterdata(Pokemon);

export async function GET() {
  return new Response(JSON.stringify(items), {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
      'Content-Type': 'application/json'
    }
  });
}
