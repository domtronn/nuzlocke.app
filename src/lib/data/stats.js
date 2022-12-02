import { HP, Atk, Spa, Def, Spd, Spe } from '$icons';

export const StatIconMap = {
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe
};

export const stats = Object.keys(StatIconMap);
