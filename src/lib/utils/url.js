import { browser } from '$app/env'

export const parseHash = () => {
  const hash = (window.location.hash || '#').slice(1)
  return Object
    .fromEntries(
      hash
        .split('&')
        .map(kv => kv.split('='))
    )
}

const toString = (hash) => {
  return Object
    .entries(hash)
    .filter(([a]) => !!a)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}

export const setHash = (k, v) => {
  if (!browser) return

  const hashData = parseHash()
  window.location.hash = toString({ ...hashData, [k]: v })
  window.history.pushState({}, '', new URL(window.location))
}
