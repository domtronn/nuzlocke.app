/* eslint no-undef: 0 */
import { browser } from '$app/environment'
import { writable } from 'svelte/store'

import { NuzlockeGroups } from '$lib/data/states'
import { toObj } from '$lib/utils/obj'
import { uuid } from '$lib/utils/uuid'

import { settingsDefault } from '$lib/components/Settings/_data'

/** TODO: Team state
    __teams: { [bossKey]: [id,id,id] }
    __team: [id,id,id]
*/

export const popover = writable(null)

export const readdata = (_) => {
  const active = window.localStorage.getItem(IDS.active)
  const saveData = _parse(window.localStorage.getItem(IDS.saves))
  const gameData = _read(window.localStorage.getItem(IDS.game(active))) || []
  const gameKey = saveData[active]?.game

  return [gameData, gameKey, active, saveData[active]]
}

export const IDS = {
  user: 'nuzlocke.user',
  theme: 'nuzlocke.theme',
  active: 'nuzlocke',
  saves: 'nuzlocke.saves',
  consent: 'nuzlocke.consent',
  support: 'nuzlocke.support',
  game: (id) => `nuzlocke.${id}`
}

const createWritable = (
  id,
  f = (val) => browser && val && localStorage.setItem(id, val),
  ssDefault = ''
) => {
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
  if (!window.confirm('This will delete all data, are you sure?')) return

  localStorage.removeItem(IDS.game(id))
  savedGames.update((g) => {
    if (!id)
      return g
        .split(',')
        .filter((i) => !i.startsWith('|'))
        .join(',')

    return g
      .split(',')
      .filter((i) => !i.startsWith(id) && !i.startsWith('|'))
      .join(',')
  })
}

export const createUser = () => {
  if (!browser) return
  localStorage.setItem(IDS.user, localStorage.getItem(IDS.user) || uuid())
}

let gameStoreCache = {}
export const getGameStore = (id) => {
  if (gameStoreCache[id]) return gameStoreCache[id]
  gameStoreCache[id] = getGame(id)
  return gameStoreCache[id]
}

export const createGame =
  (name, game, initData = '{}') =>
  (payload) => {
    if (!browser) return

    const id = uuid()
    const games =
      payload === 'null' || payload === null || payload === 'undefined'
        ? []
        : payload.split(',').filter((i) => i.length)

    const gameData = format({
      id,
      created: +new Date(),
      name,
      game,
      settings: settingsDefault
    })

    localStorage.setItem(IDS.game(id), initData)
    activeGame.set(id)

    console.log(`Creating new game for ${name} ${game}`)
    return games.concat(gameData).join(',')
  }

export const updateGame = (game) => (payload) => {
  if (!browser) return

  const games =
    payload === 'null' || payload === null || payload === 'undefined'
      ? []
      : _parse(payload)

  games[game.id] = game

  return Object.values(games).map(format).join(',')
}

export const updatePokemon = ({ customId, customName, ...p } = {}) => {
  activeGame.subscribe((gameId) => {
    getGameStore(gameId).update(
      patch({
        [customId || p.location]: p
      })
    )
  })
}

export const killPokemon = ({ customId, customName, ...p }) => {
  activeGame.subscribe((gameId) => {
    getGameStore(gameId).update(
      patch({
        [customId || p.location]: { ...p, status: 5 }
      })
    )
  })
}

export const getGen = (_) =>
  new Promise((resolve) => {
    activeGame.subscribe((gameId) => {
      savedGames.subscribe(
        parse((games) => {
          resolve(games[gameId]?.game)
        })
      )
    })
  })

export const getGame = (id) =>
  createWritable(
    IDS.game(id),
    (val) => {
      if (!browser) return
      if (!val) return
      localStorage.setItem(IDS.game(id), val)
    },
    {}
  )

export const readTeam = (data) => {
  return data.__team
}

export const readTeams = (data) => {
  return data.__teams || []
}

export const readBox = (data) => {
  const customIdMap = toObj(data.__custom, 'id')
  const customLocMap = toObj(data.__custom, 'name')

  return Object.values(data)
    .filter((i) => i.pokemon)
    .filter(({ status }) => NuzlockeGroups.Available.includes(status))
    .map((p) => {
      // Read custom location data from data.__custom
      let custom
      if (customIdMap?.[p.location]) custom = customIdMap?.[p.location]
      else if (customLocMap?.[p.location]) custom = customLocMap?.[p.location]

      return custom ? { ...p, customId: custom.id, customName: custom.name } : p
    })
}

export const getBox = (cb = () => {}) =>
  activeGame.subscribe((gameId) => {
    if (browser && !gameId) return (window.location = '/')

    getGameStore(gameId).subscribe(read((data) => cb(readBox(data))))
  })

export const patch = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    ...payload
  })

export const addlocation = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: (JSON.parse(data).__custom || []).concat(payload)
  })

export const removelocation = (id) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: (JSON.parse(data).__custom || []).filter((i) => i.id !== id)
  })

export const patchlocation = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: JSON.parse(data).__custom.map((c) =>
      c.id === payload.id ? { ...c, ...payload } : c
    )
  })

/** Team handlers */
// FIXME: Teams a list of box indexes rather than pokemon indexs
export const getTeams = (cb = () => {}) =>
  activeGame.subscribe((gameId) => {
    getGameStore(gameId).subscribe(
      read((data) => {
        cb({
          team: data.__team || [],
          teams: data.__teams || []
        })
      })
    )
  })

const _read = (payload) => {
  if (!payload) return
  try {
    return typeof payload === 'string' ? JSON.parse(payload) : {}
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const read = (cb) => (payload) => cb(_read(payload) || {})

const _parse = (gameData) =>
  (gameData || '')
    .split(',')
    .filter((i) => i.length)
    .map((i) => i.split('|'))
    .reduce((acc, [id, time, name, game, settings, attempts = 1]) => {
      const [created, updated] = time.split('>')
      return {
        ...acc,
        [id]: {
          id,
          created,
          ...(updated ? { updated } : {}),
          name,
          game,
          settings,
          attempts
        }
      }
    }, {})

export const parse =
  (cb = () => {}) =>
  (gameData) =>
    cb(_parse(gameData))

export const format = (saveData) =>
  [
    saveData.id,
    saveData.updated
      ? saveData.created + '>' + saveData.updated
      : saveData.created,
    saveData.name,
    saveData.game,
    saveData.settings,
    +saveData.attempts || 1
  ].join('|')

export const summarise =
  (cb = (_) => {}) =>
  ({ __starter, __custom, __team = [], __teams, ...data }) => {
    const pkmn = Object.values(data)
    cb({
      available: pkmn.filter(
        (i) => i?.pokemon && NuzlockeGroups.Available.includes(i?.status)
      ),
      deceased: pkmn.filter(
        (i) => i?.pokemon && NuzlockeGroups.Dead.includes(i?.status)
      ),
      team: __team.map((id) => data?.[id]?.pokemon).filter((i) => i)
    })
  }

// ---- Temporary BiqQuery syncing track call
export const trackData = () => {
  if (!browser) return
  const userId = window.localStorage.getItem(IDS.user)
  const games = _parse(window.localStorage.getItem(IDS.saves))

  const gamesData = {
    user_id: userId,
    data: Object.values(games).map(({ created, updated, ...data }) => ({
      ...data,
      ...(updated ? { updated_at: updated } : {}),
      created_at: created
    }))
  }

  const savesData = Object.keys(games).reduce((acc, id) => {
    try {
      const data = Object.values(
        JSON.parse(window.localStorage.getItem(IDS.game(id)))
      ).filter(
        (d) =>
          typeof d === 'object' &&
          !d?.hidden &&
          (d?.status || d?.pokemon) &&
          Object.keys(d).length > 1
      )

      if (!Array.isArray(data) || !data.length) return acc
      return [
        ...acc,
        {
          user_id: userId,
          game_id: id,
          data
        }
      ]
    } catch (e) {
      return acc
    }
  }, [])

  const teamsData = Object.keys(games).reduce((acc, id) => {
    try {
      const data = JSON.parse(window.localStorage.getItem(IDS.game(id)))
      const team = data?.__team || []

      if (!Array.isArray(team) || !team.length) return acc

      const result = team
        .map((locId, i) => {
          const poke = data[locId]
          if (!poke) return
          return {
            position: i + 1,
            pokemon: poke.pokemon,
            location: locId
          }
        })
        .filter((i) => i)

      if (!result.length) return acc

      return [
        ...acc,
        {
          user_id: userId,
          game_id: id,
          data: result
        }
      ]
    } catch (e) {
      console.error(e)
      return acc
    }
  }, [])

  document.addEventListener('visibilitychange', function logData() {
    if (document.visibilityState === 'hidden') {
      const createBlob = (json) =>
        new Blob([JSON.stringify(json)], { type: 'application/json' })
      navigator.sendBeacon('/api/store/game', createBlob(gamesData))
      savesData.forEach((save) =>
        navigator.sendBeacon('/api/store/save', createBlob(save))
      )
      teamsData.forEach((save) =>
        navigator.sendBeacon('/api/store/team', createBlob(save))
      )
    }
  })
}
// --------

const fixDupes = () => {
  console.log('--------------------\tFixing Dupes')
  activeGame.subscribe((gameId) => {
    getGame(gameId).subscribe(
      read((data) => {
        console.log('--------------------\tLoaded game data')
        const dupeKeys = Object.values(
          Object.entries(data)
            .filter(([key]) => !key.startsWith('__'))
            .reduce(
              (acc, [key, val]) => ({
                ...acc,
                [val.id]: [].concat(acc[val.id] || []).concat(key)
              }),
              {}
            )
        ).filter((i) => i.length > 1)

        if (!dupeKeys.length) {
          console.log(`--------------------\tDone! Nothing to fix`)
          return
        }

        console.log(
          `--------------------\tFound ${dupeKeys.length} items to patch`
        )
        const temp = { ...data }
        dupeKeys.forEach((keys) => {
          keys.forEach((key) => {
            if ((data.__custom || []).find((c) => c.id === key)) {
              console.log(
                `----------\tSubstituing`,
                key,
                'with',
                data[keys[keys.length - 1]],
                'from',
                keys[keys.length - 1]
              )
              temp[key] = data[keys[keys.length - 1]]
            } else {
              console.log(`----------\tDeleting`, key)
              delete temp[key]
            }
          })
        })

        console.log(`--------------------\tProposed new state`)
        console.log(temp)
        getGame(gameId).set(JSON.stringify(temp))
      })
    )
  })
}

fixDupes()

if (typeof window !== 'undefined')
  window.nz = {
    saves: function () {
      return [
        window.localStorage.getItem(IDS.saves),
        _parse(window.localStorage.getItem(IDS.saves))
      ]
    },
    getGame: function (id) {
      const data = JSON.parse(
        window.localStorage[`nuzlocke.${window.localStorage['nuzlocke']}`]
      )
      return id ? data[id] : data
    },
    getCustom: function () {
      const data = nz.getGame()
      const custom = data.__custom || []
      return [custom, custom.map((it) => data[it.id])]
    },
    getCaught: function () {
      const data = nz.getGame()
      return Object.values(data).filter((i) => i.status === 1)
    },
    getDead: function () {
      const data = nz.getGame()
      return Object.values(data).filter((i) => i.status === 5)
    },
    resetProgress: function () {
      const id = `nuzlocke.${window.localStorage['nuzlocke']}`
      if (!id) return 'Not sure'

      const { __teams, ...data } = JSON.parse(window.localStorage[id])
      window.localStorage.setItem(id, JSON.stringify({ ...data, __teams: [] }))
    }
  }
