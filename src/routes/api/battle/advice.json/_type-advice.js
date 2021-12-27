import { typeAdvMap } from './_types'

/**
 * Calculates the damage modifier for an attack given a list of defensive types
 * @param {string} atkType - The attacking move type
 * @param {string[]} defType - The defensive types being hit
 * @returns {int} The damage mod of the attack against the types
 */
export const moveResistance = (atkType, pkmnTypes) => {
  const res = pkmnTypes.reduce((acc, defType) => {
    return acc * (typeAdvMap[atkType][defType] || 1)
  }, 1)

  return res
}

/**
 * Calculates the maximum damage mod for a pokemon vs an attacking moveset
 * @param {string[]} atkTypes - List of attacking move types
 * @param {string[]} pkmnTypes - List of defending types
 */
export const coverageResistance = (atkTypes, pkmnTypes) =>
  Math.max(...atkTypes.map(atkType => moveResistance(atkType, pkmnTypes)))

export default (defTeam, atkTeam) => {
  // Loop through each defending pokemon and determine how well it
  // resists individual attacking mons and team
  return defTeam.map(({ sprite: defName, types: defTypes }) => {
    const coverageAll = atkTeam.map(({ name: atkName, types: atkTypes }) => {
      const maxDmgMod = coverageResistance(atkTypes, defTypes)

      return { atkName, maxDmgMod }
    })

    return [
      defName,
      coverageAll.reduce((acc, { atkName, maxDmgMod }) => ({ ...acc, [atkName]: maxDmgMod }), {}),
    ]
  })
}
