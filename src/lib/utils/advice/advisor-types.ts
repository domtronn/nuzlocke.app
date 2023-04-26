import { typeAdvMap } from './types'

interface IPokemon {
  alias: string
  types: string[]
}

/**
 * Calculates the damage modifier for an attack given a list of defensive types
 */
export const moveResistance = (atkType: string, defTypes: string[]): number => {
  const res = defTypes.reduce((acc, defType) => {
    const mod = typeAdvMap[atkType][defType]
    return acc * (typeof mod === 'undefined' ? 1 : mod)
  }, 1)

  return res
}

/**
 * Calculates the maximum damage mod for a pokemon vs an attacking moveset
 */
export const coverageResistance = (atkTypes: string[], pkmnTypes: string[]) =>
  Math.max(...atkTypes.map((atkType) => moveResistance(atkType, pkmnTypes)))

export default (defTeam: IPokemon[], atkTeam: IPokemon[]) => {
  // Loop through each defending pokemon and determine how well it
  // resists individual attacking mons and team
  return defTeam.map(({ alias: defName, types: defTypes }) => {
    const coverageAll = atkTeam.map(({ alias: atkName, types: atkTypes }) => {
      const maxDmgMod = coverageResistance(atkTypes, defTypes)

      return { atkName, maxDmgMod }
    })

    return [
      defName,
      coverageAll.reduce(
        (acc, { atkName, maxDmgMod }) => ({ ...acc, [atkName]: maxDmgMod }),
        {}
      )
    ]
  })
}
