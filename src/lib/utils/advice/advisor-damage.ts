import { NaturesMap } from '$lib/data/natures'
import { moveResistance } from './advisor-types'

interface IMove {
  type: string
  power: number
  damage_class: 'status' | 'special' | 'physical'
}

interface IPokemon {
  alias: string
  types: [string, string] | [string]
  nature: string
  level: number
  baseStats: IStats
  original: {
    level: number | string
    stats: IStats
    moves: IMove[]
  }
}

interface IStats {
  atk: number
  def: number
  spa: number
  spd: number
}

const calcNatMod = (
  nature: string,
  stat: 'spa' | 'atk' | 'spd' | 'def'
): number => {
  const [pos, neg] = NaturesMap[nature]?.value || []
  if (pos === stat) return 1.1
  if (neg === stat) return 0.9
  return 1
}

// https://pokemon.fandom.com/wiki/Statistics#Attack
const calcEffectiveStat = (
  pokemon: IPokemon,
  stat: 'spa' | 'atk' | 'spd' | 'def' | 'hp',
  iv: number = 31,
  ev: number = 0
): number => {
  const stats = pokemon?.original?.stats || pokemon.baseStats
  const core = Math.floor(
    0.01 * (2 * stats[stat] + iv + Math.floor(0.25 * ev)) * pokemon.level
  )

  if (stat === 'hp') return core + pokemon.level + 10
  return (core + 5) * calcNatMod(pokemon.nature, stat)
}

const calcDamage = (
  atkMon: IPokemon,
  atkMove: IMove,
  defMon: IPokemon
):
  | {
      dRng: [number, number]
      cRng: [number, number]
      pRng: [number, number]
    }
  | undefined => {
  if (atkMove.damage_class === 'status') return

  let A: number, D: number
  if (atkMove.damage_class === 'special') {
    A = calcEffectiveStat(atkMon, 'spa')
    D = calcEffectiveStat(defMon, 'spd')
  } else {
    A = calcEffectiveStat(atkMon, 'atk')
    D = calcEffectiveStat(defMon, 'def')
  }

  const STAB = atkMon.types.includes(atkMove.type) ? 1.5 : 1
  const TYPE = moveResistance(atkMove.type, defMon.types)

  const dmg = Math.floor(
    ((((2 * atkMon.level) / 5 + 2) * atkMove.power * (A / D)) / 50 + 2) *
      STAB *
      TYPE
  )

  const [min, max] = [Math.floor(dmg * 0.85), dmg]
  const defHp = calcEffectiveStat(defMon, 'hp')

  const critRange: [number, number] = [
    Math.floor(min * 1.5),
    Math.floor(max * 1.5)
  ]

  const pctRange: [number, number] = [
    Math.ceil((100 * min) / defHp),
    Math.ceil((100 * max) / defHp)
  ]

  return {
    dRng: [min, max],
    cRng: critRange,
    pRng: pctRange
  }
}

export const calcTeamDamage = (box: IPokemon[], team: IPokemon[]) =>
  box.map((defMon) => {
    const defId = defMon.alias

    const lvlCap = Math.max(...team.map((mon) => +mon.original.level))
    const teamMoveDmg = team.map((atkMon, i) => {
      const atkId = atkMon.alias
      const atkMoves = atkMon.original.moves

      return [
        `${atkId}-${i}`,
        atkMoves.map((move) => {
          if (!move.power || move.damage_class === 'status') return move
          try {
            //  Adjust levels according to levelcap
            const relLvl = +atkMon.original.level < 5
            const atkLvl = relLvl
              ? 50 + +atkMon.original.level
              : +atkMon.original.level
            const defLvl = relLvl ? 50 : lvlCap

            const res = calcDamage({ ...atkMon, level: atkLvl }, move, {
              ...defMon,
              level: defLvl
            })

            return { ...move, range: res.dRng, desc: res.pRng }
          } catch (e) {
            return move
          }
        })
      ]
    })

    return [defId, Object.fromEntries(teamMoveDmg)]
  })

export default calcTeamDamage
