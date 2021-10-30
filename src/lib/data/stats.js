import HP from 'svelte-icons-pack/ti/TiHeartFullOutline'
import Atk from 'svelte-icons-pack/fa/FaSolidFistRaised'
import Spa from 'svelte-icons-pack/fi/FiTarget'
import Def from 'svelte-icons-pack/bi/BiSolidShield'
import Spd from 'svelte-icons-pack/fa/FaSolidBrain'
import Spe from 'svelte-icons-pack/bs/BsLightningFill'

export const StatIconMap = {
  hp: HP,
  atk: Atk,
  spa: Spa,
  def: Def,
  spd: Spd,
  spe: Spe
}

export const stats = Object.keys(StatIconMap)
