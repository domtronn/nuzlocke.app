export async function handle ({ event, request, resolve }) {
  const response = await resolve(request)

  if (request.path.startsWith('/sprites/'))
    response.headers = {
      ...response.headers,
      'Cache-Control': 'public, max-age=31536000, must-revalidate',
      'X-Hooked': true
    }

  return response
}
