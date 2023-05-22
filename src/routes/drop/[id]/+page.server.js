import { SHARE } from '$utils/rewrites'

export async function load({ params, fetch }) {
  const res = await fetch(`${SHARE}/${params.id}`)
  const json = await res.json()

  if (json.error) {
    throw error(410, {
      message: json.error,
      action: 'Try <a href="/saves">scanning the QR code</a> again'
    })
  }

  return json
}
