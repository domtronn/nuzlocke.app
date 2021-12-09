/**
 * Takes a parsed boss datum and pretends to reconstruct the render
 * model using data. This is a close approximation to the main branch
 * logic however use pokemon-assets rather than the pokeapi
 * @param {Object} datum
 * @param {Object} data
 * @returns {[string, Object]} An error tuple,
 */
export const fauxfetch = (datum, data) => {
  let fauxerrors = [] // Reset list of errors

  const fullP = data.pokemon[datum.name]
  if (datum.name && !fullP)
    fauxerrors.push(`Invalid pokemon: ${datum.name}`)
  if (datum.level && isNaN(datum.level))
    fauxerrors.push(`Invalid level: '${datum.level}' must be a number`)

  const fullMoves = (datum?.moves || []).map(m => {
    const move = data.moves[m]
    if (!move) {
      fauxerrors.push(`Inalid move: ${m}`)
      return
    }

    return {
      name: move.name,
      damage_class: move.category.toLowerCase(),
      power: move.basePower,
      priority: move.priority,
      type: move.type.toLowerCase()
    }
  })

  const fullAbility = data.abilities[datum.ability]
  if (datum.ability && !fullAbility) fauxerrors.push(`Invalid ability: ${datum.ability}`)

  const fullItem = data.items[datum.held]
  if (datum.held && !fullItem) fauxerrors.push(`Invalid item: ${datum.held}`)

  let err = fauxerrors.length ? fauxerrors : null

  if (!fullP) return [err] // Exit early

  return [
    err,
    {
      ...fullP,
      ...datum,
      level: datum.level ? isNaN(datum.level) ? '??' : datum.level : '',
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fullP.num}.png`,
      held: fullItem ? { name: fullItem.name, effect: '...', sprite: fullItem.sprite } : '',
      ability: fullAbility ? { name: fullAbility.name } : '',
      stats: fullP.baseStats,
      types: fullP.types.map(i => i.toLowerCase()),
      maxStat: Math.max(...Object.values(fullP.baseStats)),
      moves: fullMoves.filter(i => !!i)
    }
  ]
}
