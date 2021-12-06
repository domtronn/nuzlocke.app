import https from 'https'

const opts = {
  method: 'GET',
  hostname: 'tinyurl.com',
  port: 443
}

export async function get ({ params, host, req }) {
  return new Promise(resolve => {
    const req = https.request(
      { ...opts, path: '/' + params.id },
      res => {
        const { location } = res.headers

        if (!location) return resolve({ status: 404 })
        if (!location.includes(`://${host}`)) return resolve({ status: 400 })

        return resolve({
          status: 301,
          headers: {
            Location: location
          }
        })
      }
    )

    req.end()
  })
}
