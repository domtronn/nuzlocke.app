import { typeAdvMap, pivotWeaknesses as weaknesses } from './_types'

/**
 * Calculates the damage modifier for an attack given a list of defensive types
 * @param {string} atkType - The attacking move type
 * @param {string[]} defType - The defensive types being hit
 * @returns {int} The damage mod of the attack against the types
 */
const moveResistance = (atkType, pkmnTypes) => {
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
const coverageResistance = (atkTypes, pkmnTypes) =>
  Math.max(...atkTypes.map(atkType => moveResistance(atkType, pkmnTypes)))

/**
 * Calculates the minimum damage mode for a pokemon vs an attacking moveset
 * @param {string[]} atkTypes - List of attacking move types
 * @param {string[]} pkmnTypes - List of defending move types
 */
const coverageWeakness = (atkTypes, pkmnTypes) =>
  Math.min(...atkTypes.map(atkType => moveResistance(atkType, pkmnTypes)))

const calcSuitability = ({ atkName, maxDmgMod, minDmgMod, avgDmgMod }) => {
  let suitability = 0
  if (maxDmgMod < 1) suitability = 2                          // Max damage they can take is less than one so very suitable
  else if (minDmgMod > 1 || avgDmgMod > 1.5) suitability = -1 //  min damage they can take is more than 1 or on average taking more than 1.5 so not suitable
  else if (avgDmgMod < 1) suitability = 1                     // avg dmg is less than 1 so sort of suitable

  return atkName ? [atkName, suitability] : suitability
}

export default (defTeam, atkTeam) => {
  // Loop through each defending pokemon and determine how well it
  // resists individual attacking mons and team
  return defTeam.map(({ sprite: defName, types: defTypes }) => {
    const coverageAll = atkTeam.map(({ name: atkName, types: atkTypes }) => {
      const maxDmgMod = coverageResistance(atkTypes, defTypes)

      return { atkName, maxDmgMod }
    })

    return {
      name: defName,
      dmg: coverageAll.reduce((acc, { atkName, maxDmgMod }) => ({ ...acc, [atkName]: maxDmgMod }), {}),
    }
  })
    .reduce((acc, { name, dmg }) => ({
      ...acc,
      [name]: dmg
    }), {})
}
