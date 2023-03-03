import tiny from 'tinyurl'

export async function POST ({ request }) {
  const { host } = new URL(request.url)

  const body = await request.json()
  const url = await tiny.shorten(body.url)

  return new Response(JSON.stringify({
    url: url.replace('tinyurl.com', host + '/drop')
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
