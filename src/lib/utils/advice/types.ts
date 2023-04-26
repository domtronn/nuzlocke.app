interface AdvantageMap {
  [key: string]: {
    '0.25'?: string[]
    '0.5'?: string[]
    '0'?: string[]
    '2'?: string[]
    '4'?: string[]
  }
}

export const typeAdvantages: AdvantageMap = {
  normal: { 0.5: ['rock', 'steel'], 0: ['ghost'] },
  fire: {0.5: ['fire', 'water', 'rock', 'dragon'], 2: ['grass', 'ice', 'bug', 'steel']},
  water: { 0.5: ['water', 'grass', 'dragon'], 2: ['fire', 'ground', 'rock'] },
  grass: {0.5: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], 2: ['water', 'ground', 'rock']},
  electric: {0.5: ['electric', 'grass', 'dragon'], 0: ['ground'], 2: ['water', 'flying']},
  ice: {0.5: ['fire', 'water', 'ice', 'steel'], 2: ['grass', 'ground', 'flying', 'dragon']},
  fighting: {0.5: ['poison', 'flying', 'psychic', 'bug', 'fairy'], 0: ['ghost'], 2: ['normal', 'ice', 'rock', 'dark', 'steel']},
  flying: {0.5: ['electric', 'rock', 'steel'], 2: ['grass', 'fighting', 'bug']},
  poison: {0.5: ['poison', 'ground', 'rock', 'ghost'], 0: ['steel'], 2: ['grass', 'fairy']},
  ground: {0.5: ['grass', 'bug'], 0: ['flying'], 2: ['fire', 'electric', 'poison', 'rock', 'steel']},
  rock: {0.5: ['fighting', 'ground', 'steel'], 2: ['fire', 'ice', 'flying', 'bug']},
  steel: {0.5: ['fire', 'water', 'electric', 'steel'], 2: ['ice', 'rock', 'fairy']},
  ghost: { 0.5: ['dark'], 0: ['normal'], 2: ['psychic', 'ghost'] },
  fairy: {0.5: ['fire', 'poison', 'steel'], 2: ['fighting', 'dragon', 'dark']},
  dragon: { 0.5: ['steel'], 0: ['fairy'], 2: ['dragon'] },
  dark: { 0.5: ['fighting', 'dark', 'fairy'], 2: ['psychic', 'ghost'] },
  bug: {0.5: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], 2: ['grass', 'psychic', 'dark']},
  psychic: { 0.5: ['psychic', 'steel'], 0: ['dark'], 2: ['fighting', 'poison'] }
}

export const typeAdvMap = Object.entries(typeAdvantages).reduce(
  (acc, [type, advs]) => ({
    ...acc,
    [type]: Object.entries(advs).reduce(
      (acc, [adv, types]) => ({
        ...acc,
        ...types.reduce((acc, type) => ({ ...acc, [type]: +adv }), {})
      }),
      {}
    )
  }),
  {}
)

const weakness = (type) => {
  return Object.entries(typeAdvMap)
    .filter(([, dmgMod]) => typeof dmgMod[type] !== 'undefined')
    .map(([t, dmgMod]) => [t, dmgMod[type]])
    .reduce((acc, [t, dmgMod]) => ({ ...acc, [t]: dmgMod }), {})
}

export const weaknesses = (t1, t2) => {
  if (!t2) return weakness(t1)

  const w1 = weakness(t1)
  const w2 = weakness(t2)

  return Object.entries(w1).reduce((acc, [t, dmgMod]) => {
    const mod = (typeof acc[t] === 'undefined' ? 1 : acc[t]) * dmgMod

    if (mod === 1) {
      delete acc[t]
      return acc
    }

    return { ...acc, [t]: mod }
  }, w2)
}

export const pivotWeaknesses = (...types: string[]) => {
    const [t1, t2] = types
  return Object.entries(weaknesses(t1, t2)).reduce(
    (acc, [t, mod]) => ({
      ...acc,
      [mod]: (acc[mod] || []).concat(t)
    }),
    {}
  )
}
