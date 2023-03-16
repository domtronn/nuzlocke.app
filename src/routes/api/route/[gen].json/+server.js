import Routes from '$lib/data/routes.json';

export async function GET({ params }) {
  const { gen } = params;

  if (!Routes[gen]) return new Response({ status: 404 });

  return new Response(JSON.stringify(Routes[gen]), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate'
    }
  });
}
