/* eslint no-undef: 0 */
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

import { uuid } from '$lib/utils/uuid';
import { NuzlockeGroups } from '$lib/data/states';

export const popover = writable(null);

export const readdata = (_) => {
  const active = window.localStorage.getItem(IDS.active);
  const saveData = _parse(window.localStorage.getItem(IDS.saves));
  const gameData = _read(window.localStorage.getItem(IDS.game(active))) || [];
  const gameKey = saveData[active]?.game;

  return [gameData, gameKey, active, saveData[active]];
};

export const IDS = {
  user: 'nuzlocke.user',
  theme: 'nuzlocke.theme',
  active: 'nuzlocke',
  saves: 'nuzlocke.saves',
  consent: 'nuzlocke.consent',
  support: 'nuzlocke.support',
  game: (id) => `nuzlocke.${id}`
};

const createWritable = (
  id,
  f = (val) => browser && val && localStorage.setItem(id, val),
  ssDefault = ''
) => {
  const store = browser ? localStorage.getItem(id) : ssDefault;
  const w = writable(store);
  w.subscribe(f);
  return w;
};

export const theme = createWritable(IDS.theme);
export const consent = createWritable(IDS.consent);
export const support = createWritable(IDS.support);
export const activeGame = createWritable(IDS.active);
export const savedGames = createWritable(IDS.saves);

export const deleteGame = (id) => {
  if (!window.confirm('This will delete all data, are you sure?')) return;

  localStorage.removeItem(IDS.game(id));
  savedGames.update((g) => {
    if (!id)
      return g
        .split(',')
        .filter((i) => !i.startsWith('|'))
        .join(',');

    return g
      .split(',')
      .filter((i) => !i.startsWith(id) && !i.startsWith('|'))
      .join(',');
  });
};

export const createUser =
  () => {
    if (!browser) return;
    localStorage.setItem(
      IDS.user,
      localStorage.getItem(IDS.user) || uuid()
    )
  }

export const createGame =
  (name, game, initData = '{}') =>
  (payload) => {
    if (!browser) return;

    const id = uuid();
    const games =
      payload === 'null' || payload === null || payload === 'undefined'
        ? []
        : payload.split(',').filter((i) => i.length);

    const gameData = format({
      id,
      created: +new Date(),
      name,
      game,
      settings: '011101'
    });

    localStorage.setItem(IDS.game(id), initData);
    activeGame.set(id);

    console.log(`Creating new game for ${name} ${game}`);
    return games.concat(gameData).join(',');
  };

export const updateGame = (game) => (payload) => {
  if (!browser) return;

  const games =
    payload === 'null' || payload === null || payload === 'undefined'
      ? []
      : _parse(payload);

  games[game.id] = game;

  return Object.values(games).map(format).join(',');
};

export const updatePokemon = (p) => {
  activeGame.subscribe((gameId) => {
    getGame(gameId).update(
      patch({
        [p.location]: p
      })
    );
  });
};

export const killPokemon = (p) => {
  activeGame.subscribe((gameId) => {
    getGame(gameId).update(
      patch({
        [p.location]: { ...p, status: 5 }
      })
    );
  });
};

export const getGen = (_) =>
  new Promise((resolve) => {
    activeGame.subscribe((gameId) => {
      savedGames.subscribe(
        parse((games) => {
          resolve(games[gameId]?.game);
        })
      );
    });
  });

export const getGame = (id) =>
  createWritable(
    IDS.game(id),
    (val) => {
      if (!browser) return;
      if (!val) return;
      localStorage.setItem(IDS.game(id), val);
    },
    {}
  );

export const getBox = (cb = () => {}) =>
  activeGame.subscribe((gameId) => {
    if (browser && !gameId) return (window.location = '/');

    getGame(gameId).subscribe(
      read((data) => {
        const customMap = Object.fromEntries(
          (data.__custom || []).map(m => [m.id, m])
        )
        cb(
          Object.values(data)
            .filter((i) => i.pokemon)
            .filter(({ status }) => NuzlockeGroups.Available.includes(status))
            .map(p => {
              if (customMap?.[p.location]) return {
                ...p,
                custom: customMap?.[p.location]?.name,
              }
              else return p
            })
        );
      })
    );
  });

export const patch = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    ...payload
  });

export const addlocation = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: (JSON.parse(data).__custom || []).concat(payload)
  });

export const removelocation = (id) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: (JSON.parse(data).__custom || []).filter((i) => i.id !== id)
  });

export const patchlocation = (payload) => (data) =>
  JSON.stringify({
    ...JSON.parse(data),
    __custom: JSON.parse(data).__custom.map((c) =>
      c.id === payload.id ? { ...c, ...payload } : c
    )
  });

const _read = (payload) => {
  if (!payload) return;
  try {
    return typeof payload === 'string' ? JSON.parse(payload) : {};
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const read = (cb) => (payload) => cb(_read(payload) || {});

const _parse = (gameData) =>
  (gameData || '')
    .split(',')
    .filter((i) => i.length)
    .map((i) => i.split('|'))
    .reduce(
      (acc, [id, time, name, game, settings]) => {
        const [created, updated] = time.split('>')
        return {
          ...acc,
          [id]: { id, created, ...(updated ? { updated } : {}), name, game, settings }
        }
      },
      {}
    );

export const parse =
  (cb = () => {}) =>
  (gameData) =>
    cb(_parse(gameData));

export const format = (saveData) =>
  [
    saveData.id,
    saveData.updated
      ? saveData.created + '>' + saveData.updated
      : saveData.created,
    saveData.name,
    saveData.game,
    saveData.settings
  ].join('|');

export const summarise =
  (cb = (_) => {}) =>
  ({ __starter, __custom, ...data }) => {
    const pkmn = Object.values(data);
    cb({
      available: pkmn.filter(
        (i) => i?.pokemon && NuzlockeGroups.Available.includes(i?.status)
      ),
      deceased: pkmn.filter(
        (i) => i?.pokemon && NuzlockeGroups.Dead.includes(i?.status)
      )
    });
  };

// ---- Temporary BiqQuery syncing track call
export const trackData = () => {
  if (!browser) return
  const userId = window.localStorage.getItem(IDS.user)
  const games = _parse(window.localStorage.getItem(IDS.saves))

  const gamesData = {
    user_id: userId,
    data: Object
      .values(games)
      .map(({ created, updated, ...data }) => ({
        ...data,
        ...(updated ? { updated_at: updated } : {}),
        created_at: created,
      }))
  }

  const savesData = Object
    .keys(games)
    .reduce((acc, id) => {
      try {
        const data = Object
          .values(JSON.parse(window.localStorage.getItem(IDS.game(id))))
          .filter(d => typeof d === 'object'
            && !d?.hidden
            && (d?.status || d?.pokemon)
            && Object.keys(d).length > 1
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


  document.addEventListener("visibilitychange", function logData() {

    if (document.visibilityState === "hidden") {
      const createBlob = json => new Blob([JSON.stringify(json)], { type: 'application/json' })
      navigator.sendBeacon('/api/store/game', createBlob(gamesData))
      savesData.forEach(save => navigator.sendBeacon('/api/store/save', createBlob(save)))
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
          Object
            .entries(data)
            .filter(([key]) => !key.startsWith('__'))
            .reduce((acc, [key,val]) => ({ ...acc, [val.id]: [].concat(acc[val.id] || []).concat(key) }), {})
        ).filter(i => i.length > 1)

        if (!dupeKeys.length) {
          console.log(`--------------------\tDone! Nothing to fix`)
          return
        }

        console.log(`--------------------\tFound ${dupeKeys.length} items to patch`)
        const temp = { ...data }
        dupeKeys.forEach((keys) =>{
          keys.forEach((key) => {
            if (data.__custom.find(c => c.id === key)) {
              console.log(`----------\tSubstituing`, key, 'with', data[keys[keys.length - 1]], 'from', keys[keys.length - 1])
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
    getGame: function (id) {
      const data = JSON.parse(window.localStorage[`nuzlocke.${window.localStorage['nuzlocke']}`])
      return id ? data[id] : data
    },
    getCustom: function () {
      const data = nz.getGame()
      const custom = data.__custom || []
      return [
        custom,
        custom.map(it => data[it.id])
      ]
    },
    getCaught: function () {
      const data = nz.getGame()
      return Object.values(data).filter(i => i.status === 1)
    },
    getDead: function () {
      const data = nz.getGame()
      return Object.values(data).filter(i => i.status === 5)
    }
  }
