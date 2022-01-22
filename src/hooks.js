export async function handle ({ request, resolve }) {
  const response = await resolve(request)

  response.headers = {
    ...response.headers,
    'Content-Security-Policy': `default-src 'self'; img-src *; script-src nuzlocke.app nuzlocke.vercel.app nuzlocke-beta.vercel.app nuzlocke-analytics.vercel.app`,
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff'
  }

  return response
}
