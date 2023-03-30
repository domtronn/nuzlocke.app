import { HP, Atk, Spa, Def, Spd, Spe } from '$icons';
import { BarChart,  Fire } from '$icons'

export const StatIconMap = {
  total: BarChart,
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe,
  type: Fire,
};

export const stats = Object.keys(StatIconMap);
