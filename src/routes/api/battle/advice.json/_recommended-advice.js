import { moveResistance } from './_type-advice.js'
import { weaknesses } from './_types'

const debug = []

export default (box, boss) => {
  const bossMoves = boss
    .map((poke) => poke.original.moves)
    .flat()
    .filter((move) => move.damage_class !== 'status')

  const bossMoveTypes = bossMoves.map((move) => move.type)
  const bossMoveClass = bossMoves.map((move) => move.damage_class)

  const bossTeamDmgMods = boss
    .map((poke) => weaknesses(...poke.types))
    .map((weakMap) => Object.entries(weakMap))
    .flat()

  const calcAdvMap = (compf, mods) =>
    mods.reduce((acc, [type, mod]) => {
      if (!compf(mod)) return acc
      return {
        ...acc,
        [type]: (acc[type] ?? 0) + 1
      }
    }, {})

  const calcModPct = (compf, mods, types, debug) =>
    mods.reduce((acc, type) => {
      const damageMod = moveResistance(type, types)
      if (debug) console.log(type, damageMod)
      return acc + (compf(damageMod) ? 1 : 0)
    }, 0) / mods.length

  const bossTeamWeak = calcAdvMap((mod) => mod > 1, bossTeamDmgMods)
  const bossTeamWeak4x = calcAdvMap((mod) => mod > 2, bossTeamDmgMods)
  const bossTeamResist = calcAdvMap(
    (mod) => mod < 2 && mod !== 0,
    bossTeamDmgMods
  )
  const bossTeamImmunity = calcAdvMap((mod) => mod === 0, bossTeamDmgMods)

  const recommendedMons = box
    .map(({ alias: defName, baseStats: stats, types: defTypes }) => {
      /**
       Map over each of the box pokemon types as STAB bonuses
       and calculate an "offensive" score based on usage of STAB moves
     */
      const offAdvantageScore = defTypes.reduce((acc, it) => {
        if (bossTeamWeak4x[it]) return acc + bossTeamWeak4x[it] * 4
        if (bossTeamWeak[it]) return acc + bossTeamWeak[it] * 2
        if (bossTeamResist[it]) return acc - bossTeamResist[it]
        if (bossTeamImmunity[it]) return acc - bossTeamImmunity[it] * 4
        return acc
      }, 0)

      /**
       Look over boss team moves and calculate a score based on the
       pokemons resistances to all those moves
    */

      if (debug.includes(defName)) console.log(defName)
      const defAdvantageScore = bossMoveTypes.reduce((acc, type) => {
        const damageMod = moveResistance(type, defTypes)
        if (debug.includes(defName)) console.log(type, defTypes, damageMod, acc)

        switch (damageMod) {
          case 0:
            return acc + 8
          case 0.25:
            return acc + 4
          case 0.5:
            return acc + 2
          case 2:
            return acc - 4
          case 4:
            return acc - 2
          default:
            return acc
        }
      }, 0)

      if (debug.includes(defName))
        console.log(defName, '---', offAdvantageScore, defAdvantageScore)

      /**
       Look over boss move damage classes and calculate pokemon score
       based on their defensive stat advantage
    */
      const defStatAdvantageScore = bossMoveClass.reduce((acc, dmgClass) => {
        if (dmgClass === 'physical') return acc + stats.def
        if (dmgClass === 'special') return acc + stats.spd
        return acc
      }, 0)

      /**
       Look over boss team stats and calculate an offesnsive sc
       based on their defensive stat advantage
    */
      const offStatAdvantageScore = boss.reduce((acc, mon) => {
        if (mon.baseStats.spd < mon.baseStats) return acc + stats.spa
        if (mon.baseStats.def < mon.baseStats) return acc + stats.atk
        return acc + Math.max(stats.spa, stats.atk)
      }, 0)

      return {
        name: defName,
        offTypeAdv: offAdvantageScore,
        defTypeAdv: defAdvantageScore,
        defStatAdv: defStatAdvantageScore,
        offStatAdv: offStatAdvantageScore,
        offAdv: offAdvantageScore * offStatAdvantageScore,
        defAdv: defAdvantageScore * defStatAdvantageScore,
        weakPct: calcModPct(
          (m) => m > 1,
          bossMoveTypes,
          defTypes,
          debug.includes(defName)
        ),
        resistPct: calcModPct(
          (m) => m < 1,
          bossMoveTypes,
          defTypes,
          debug.includes(defName)
        ),
        immunePct: calcModPct(
          (m) => m === 0,
          bossMoveTypes,
          defTypes,
          debug.includes(defName)
        )
      }
    })
    .map((i) => {
      if (debug.includes(i.name)) console.log(i)
      return i
    })
    .filter(
      (a) =>
        a.offAdv >= 0 && a.defAdv >= 0 && a.weakPct < 0.5 && a.resistPct >= 0
    )
    .sort((a, b) => {
      return (
        b.offAdv - a.offAdv ||
        b.defAdv - a.defAdv ||
        b.immunePct - a.immunePct ||
        b.resistPct - a.resistPct ||
        a.weakPct - b.weakPct
      )
    })

  return {
    recommendations: recommendedMons,
    advice: {
      dmgclass:
        [...new Set(bossMoveClass)].length === 1 ? [bossMoveClass[0]] : null,
      weak: Object.entries(bossTeamWeak)
        .filter(([, val]) => val === boss.length)
        .map(([key]) => key),
      resist: Object.entries(bossTeamResist)
        .filter(([, val]) => val === boss.length)
        .map(([key]) => key),
      immune: Object.entries(bossTeamImmunity)
        .filter(([, val]) => val >= boss.length / 2)
        .map(([key]) => key)
    }
  }
}
