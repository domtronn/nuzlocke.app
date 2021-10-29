/* eslint no-undef: 0 */
import { browser } from '$app/env'
import { writable } from 'svelte/store'

const id = 'nuzlocke'
const nuzlocke = browser ? localStorage.getItem(id) : {}

export const game = writable(nuzlocke)

export const patch = (payload) => (data) => JSON.stringify({
  ...JSON.parse(data),
  ...payload
})

export const read = (cb) => (payload) => {
  if (!payload) return
  let data = {}
  try { data = JSON.parse(payload) } catch (e) {}
  cb(data)
}

game.subscribe((val, ...rest) => {
  if (!browser) return
  console.log('Updating localstorage', val)
  localStorage.setItem(id, val)
})
