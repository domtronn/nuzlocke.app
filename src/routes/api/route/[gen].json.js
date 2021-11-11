import Routes from '$lib/data/routes.json'

export async function get ({ params, query }) {
  const { gen } = params

  if (!Routes[gen])
    return { status: 404 }

  return {
    body: Routes[gen],
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000',
    }
  }
}
