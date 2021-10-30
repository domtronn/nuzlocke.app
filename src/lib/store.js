/* eslint no-undef: 0 */
import { browser } from '$app/env'
import { writable } from 'svelte/store'

import { uuid } from '$lib/utils/uuid'

export const activeGame = () => {
  const nuzlocke = browser ? localStorage.getItem('nuzlocke') : ''
  const game = writable(nuzlocke)
  game.subscribe((val) => localStorage.setItem('nuzlocke', val))
  return game
}

export const createGame = (name, game) => {
  if (!browser) return

  const id = 'nuzlocke.saves'
  const games = (localStorage.getItem(id) || '').split(',').filter(i => i.length)

  console.log(`Creating new save game for ${name} ${game}`)
  const gameData = `${uuid()}|${+new Date()}|${name}|${game}`
  localStorage.setItem(id, games.concat(gameData).join(','))
}

export const getGame = (id) => {
  const nuzlocke = browser ? localStorage.getItem(`nuzlocke.${id}`) : {}
  const game = writable(nuzlocke)

  game.subscribe((val) => {
    if (!browser) return
    console.log('Updating localstorage', val)
    localStorage.setItem(`nuzlocke.${id}`, val)
  })

  return game
}

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
