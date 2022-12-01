import { HP } from '$icons';
import { Atk } from '$icons';
import { Spa } from '$icons';
import { Def } from '$icons';
import { Spd } from '$icons';
import { Spe } from '$icons';

export const StatIconMap = {
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe
};

export const stats = Object.keys(StatIconMap);
