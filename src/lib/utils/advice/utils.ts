interface IMove {
  damage_class: 'status' | 'physical' | 'special'
  type: string
}

export const moveToType = (move: IMove, prop: string = 'type') => {
  if (move.damage_class === 'status') return
  return move[prop].toLowerCase()
}

export const movesToTypes = (moves: IMove[]) =>
  moves.map((m) => moveToType(m)).filter((i) => i)

export const movesToCategory = (moves: IMove[]) =>
  moves.map((m) => moveToType(m, 'damage_class')).filter((i) => i)
