import { SHARE } from '$utils/rewrites'

export async function load({ params, fetch }) {
  const res = await fetch(`${SHARE}/${params.id}`)
  const json = await res.json()
  return json
}
