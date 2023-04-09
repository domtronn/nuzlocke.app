import { HP, Atk, Spa, Def, Spd, Spe } from '$icons';
import { BarChart, Team, Fire } from '$icons'

export const StatIconMap = {
  team: Team,
  total: BarChart,
  type: Fire,
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe,
};

export const stats = Object.keys(StatIconMap);
