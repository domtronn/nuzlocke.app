import https from 'https'

const opts = {
  method: 'GET',
  hostname: 'tinyurl.com',
  port: 443
}

const log = (msg) => console.log(`GET /drop ${msg}`)

export async function GET ({ request, params }) {
  const { host } = new URL(request.url)

  log('host :' + host)
  log('id   :' + params.id)

  return new Promise(resolve => {
    const req = https.request(
      { ...opts, path: '/' + params.id },
      res => {
        let { location } = res.headers

        log('loaction :' + location)

        if (host.startsWith('localhost')) {
          location = location.replace(/.*?\/drop/, `http://${host}/drop`)
        }

        if (!location) return resolve(new Response('', { status: 404 }))
        if (!location.includes(`://${host}`)) return resolve(Response('', { status: 400 }))

        return resolve(new Response('', {
          status: 301,
          headers: {
            Location: location
          }
        }))
      }
    )

    req.end()
  })
}
