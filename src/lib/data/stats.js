import { Atk, BarChart, Def, Fire, HP, Spa, Spd, Spe, Team } from '$icons'

export const StatIconMap = {
  team: Team,
  total: BarChart,
  type: Fire,
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe
}

export const StatLongMap = {
  total: 'Base Stat Total',
  hp: 'HP',
  atk: 'Attack',
  spa: 'Special Attack',
  spd: 'Special Defense',
  def: 'Defense',
  spe: 'Speed'
}

export const stats = Object.keys(StatIconMap)
