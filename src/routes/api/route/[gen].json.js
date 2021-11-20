import Routes from '$lib/data/routes.json'

export async function get ({ params }) {
  const { gen } = params

  if (!Routes[gen])
    return { status: 404 }

  return {
    body: Routes[gen],
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
    }
  }
}
