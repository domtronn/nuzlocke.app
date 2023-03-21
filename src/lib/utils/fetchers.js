import { browser } from '$app/environment'
import { getGen } from '$store'

const data = {}
export const fetchData = async () => {
  if (!browser) return

  const gen = await getGen()
  const uri = `/api/${gen}/pokemon.json`
  if (data[gen]) return data[gen]        // Return the raw data if it exists
  if (!data[uri]) data[uri] = fetch(uri) // "Cache" the promise rather than make a new fetch each time
    .then(res => res.json())

  data[gen] = await data[uri]
  return data[gen]
}

const league = {}
export const fetchLeague = async (game, starter = 'fire') => {
  if (!browser) return

  const id = `${game}@${starter}`
  const uri = `/league/${game}.${starter}.json`
  if (league[id]) return league[id]
  if (!league[uri]) league[uri] = fetch(uri)
    .then(res => res.json())

  league[id] = await league[uri]
  return league[id]
}

const route = {}
export const fetchRoute = async (game, fetch) => {
  if (!browser) return

  const uri = `/api/route/${game}.json`
  if (route[game]) return route[game]
  if (!route[uri]) route[uri] = fetch(uri)
    .then(res => res.json())

  route[game] = await route[uri]
  return route[game]
}

const trainers = {}
export const fetchTrainers = async (game) => {
  if (!browser) return

  const uri = `/api/${game}/trainers.json`
  if (trainers[game]) return trainers[game]
  if (!trainers[uri]) trainers[uri] = fetch(uri)
    .then(res => res.json())

  trainers[game] = await trainers[uri]
  return trainers[game]
}
