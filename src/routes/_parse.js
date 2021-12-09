/**
 * Returns an object exluding null values
 * @param {Object} o - Object with null values
 * @returns {Object}
 */
const nonnull = (o = {}) => Object.fromEntries(Object.entries(o).filter(([, val]) => !!val))

/**
 * Parses a text line into "boss" or "leader" data
 * @param {string} l - Text line of boss data in the format <id>|<name>|<speciality>|<imgpath>
 * @returns {Object}
 */
const parseleader = l => {
  const [id, name, speciality, img] = l.replace(/#.*$/g, '').slice(2).trim().split('|')
  return [id, { [id]: nonnull({ name, speciality, img, pokemon: [] })}]
}

/**
 * Parses a text line into a pokemon data object
 * @param {string} l - Pipe separated line of data in the format <pokemon>|<level>|<moves>|<ability>|<helditem>|<starterdependency>
 * @returns {Object}
 */
const parsepokemon = l => {
  const [name, level, moves = '', ability, held, starter] = l.split('|')
  return nonnull({ name, level, moves: moves.split(',').filter(i => i.length).map(i => i.trim()), ability, held, starter })
}

/**
 * Parses a text document line by line into boss data format
 * @param {string} text
 */
export const parse = text => {
  if (!text) return {}

  let currScope

  return text
    .split('\n')
    .reduce((acc, it) => {
      if (!it.trim().length || it.startsWith('#')) return acc // ignore blank lines and comments
      if (it.startsWith('--')) {
        const [id, data] = parseleader(it)
        currScope = id
        return { ...acc, ...data }
      }

      if (!acc[currScope]) return acc

      return {
        ...acc,
        [currScope]: {
          ...acc[currScope],
          pokemon: acc[currScope]?.pokemon.concat(
            parsepokemon(it)
          )
        }
      }

    }, {})
}
