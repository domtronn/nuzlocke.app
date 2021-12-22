/* eslint no-undef: 0 */
import { browser } from '$app/env'
import { writable } from 'svelte/store'

import { uuid } from '$lib/utils/uuid'
import { NuzlockeGroups } from '$lib/data/states'

export const popover = writable(null)

export const readdata = _ => {
  const active = window.localStorage.getItem(IDS.active)
  const saveData = _parse(window.localStorage.getItem(IDS.saves))
  const gameData = _read(window.localStorage.getItem(IDS.game(active)))
  const gameKey = saveData[active]?.game

  return [gameData, gameKey, active]
}

export const IDS = {
  theme: 'nuzlocke.theme',
  active: 'nuzlocke',
  saves: 'nuzlocke.saves',
  consent: 'nuzlocke.consent',
  support: 'nuzlocke.support',
  game: id => `nuzlocke.${id}`,
}

const createWritable = (id, f = val => browser && val && localStorage.setItem(id, val), ssDefault = '') => {
  const store = browser ? localStorage.getItem(id) : ssDefault
  const w = writable(store)
  w.subscribe(f)
  return w
}

export const theme = createWritable(IDS.theme)
export const consent = createWritable(IDS.consent)
export const support = createWritable(IDS.support)
export const activeGame = createWritable(IDS.active)
export const savedGames = createWritable(IDS.saves)

export const deleteGame = (id) => {
  if (!window.confirm('This will delete all data, are you sure?'))
    return

  localStorage.removeItem(IDS.game(id))
  savedGames.update(g => {
    return g
      .split(',')
      .filter(i => !i.startsWith(id))
      .join(',')
  })
}

export const createGame = (name, game) => (payload) => {
  if (!browser) return

  const id = uuid()
  const games = payload === 'null' || payload === null || payload === 'undefined'
    ? []
    : payload.split(',').filter(i => i.length)

  const gameData = format({
    id,
    created: +new Date(),
    name,
    game
  })

  localStorage.setItem(IDS.game(id), '{}')
  activeGame.set(id)

  console.log(`Creating new game for ${name} ${game}`)
  return games.concat(gameData).join(',')
}

export const getGen = _ => new Promise((resolve) => {
  activeGame.subscribe(gameId => {
    savedGames.subscribe(parse(games => {
      resolve(games[gameId]?.game)
    }))
  })
})

export const getGame = (id) => createWritable(
  IDS.game(id),
  (val) => {
    if (!browser) return
    if (!val) return
    localStorage.setItem(IDS.game(id), val)
  },
  {}
)

export const getBox = (cb = () => {}) => activeGame.subscribe(gameId => {
  if (browser && !gameId) return window.location = '/'

  getGame(gameId).subscribe(read(data => {
    cb(Object
       .values(data)
       .filter(i => i.pokemon)
       .filter(({ status }) => !status || NuzlockeGroups.Available.includes(status)))
  }))
})

export const patch = (payload) => (data) => JSON.stringify({
  ...JSON.parse(data),
  ...payload
})

export const addlocation = (payload) => (data) => JSON.stringify({
  ...JSON.parse(data),
  __custom: (JSON.parse(data).__custom || [])
    .concat(payload)
})

export const removelocation = (id) => data => JSON.stringify({
  ...JSON.parse(data),
  __custom: (JSON.parse(data)
    .__custom || [])
    .filter(i => i.id !== id)
})

export const patchlocation = (payload) => data => JSON.stringify({
  ...JSON.parse(data),
  __custom: JSON.parse(data)
    .__custom
    .map(c => c.id === payload.id ? { ...c, ...payload } : c)
})

const _read = (payload) => {
  if (!payload) return
  try {
    return typeof payload === 'string'
      ? JSON.parse(payload)
      : {}
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const read = (cb) => (payload) => cb(_read(payload) || {})

const _parse = (gameData) => (gameData || '')
      .split(',')
      .filter(i => i.length)
      .map(i => i.split('|'))
      .reduce((acc, [id, created, name, game]) => ({
        ...acc,
        [id]: { id, created, name, game }
      }), {})

export const parse = (cb = () => {}) => (gameData) => cb(_parse(gameData))

export const format = (saveData) => [
  saveData.id,
  saveData.created,
  saveData.name,
  saveData.game,
].join('|')


export const summarise = (cb = _ => {}) => ({ __starter, ...data }) => {
  const pkmn = Object.values(data)
  cb({
    available: pkmn.filter(i => i.pokemon && (!i.status || NuzlockeGroups.Available.includes(i?.status))),
    deceased: pkmn.filter(i => i.pokemon && NuzlockeGroups.Dead.includes(i?.status))
  })
}
