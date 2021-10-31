/* eslint no-undef: 0 */
import { browser } from '$app/env'
import { writable } from 'svelte/store'

import { uuid } from '$lib/utils/uuid'

const IDS = {
  saves  : 'nuzlocke.saves',
  active : 'nuzlocke',
  game   : id => `nuzlocke.${id}`
}

const createWritable = (id, f = val => browser && val && localStorage.setItem(id, val), ssDefault = '') => {
  const store = browser ? localStorage.getItem(id) : ssDefault
  const w = writable(store)
  w.subscribe(f)
  return w
}

export const activeGame = createWritable(IDS.active)
export const savedGames = createWritable(IDS.saves)

export const createGame = (name, game) => (payload) => {
  if (!browser) return

  const games = payload === 'null' || payload === null || payload === 'undefined'
    ? []
    : payload.split(',').filter(i => i.length)
  const gameData = `${uuid()}|${+new Date()}|${name}|${game}`

  console.log(`Creating new game for ${name} ${game}`)

  return games.concat(gameData).join(',')
}

export const getGame = (id) => createWritable(
  IDS.game(id),
  (val) => {
    if (!browser) return
    console.log('Updating localstorage', val)
    localStorage.setItem(IDS.game(id), val)
  },
  {}
)

export const patch = (payload) => (data) => JSON.stringify({
  ...JSON.parse(data),
  ...payload
})

export const read = (cb) => (payload) => {
  if (!payload) return
  let data = {}
  try { data = JSON.parse(payload) } catch (e) {}
  cb(data || {})
}
