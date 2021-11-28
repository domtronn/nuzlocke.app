export const moveToType = (move, prop = 'type') => {
  if (move.damage_class === 'status') return
  return move[prop].toLowerCase()
}

export const movesToTypes = moves => moves.map(m => moveToType(m)).filter(i => i)
export const movesToCategory = moves => moves.map(m => moveToType(m, 'damage_class')).filter(i => i)
