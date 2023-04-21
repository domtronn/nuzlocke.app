import games from './games.json'

export const Expanded = Object.fromEntries(
  Object
    .entries(games)
    .reduce((acc, [key, game]) => {
      if (!game.difficulty) return acc.concat([[key, game]])
      return acc.concat(
        game.difficulty.map((d) => {
          const [name, idmod] = d.split(':')

          return [key + idmod, {
            ...game,
            difficulty: name,
            pid: game.pid + idmod,
            title: game.title + ' ' + name
          }]
        })
      )
    }, [])
)

export const RegionMap = Object.fromEntries(
  Object
    .entries(games)
    .map(([key, data]) => [key, data.region])
)

export const Base = games
export default Base
