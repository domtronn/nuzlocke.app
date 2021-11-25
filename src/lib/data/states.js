import Ball from 'svelte-icons-pack/cg/CgPokemon'
import Gift from 'svelte-icons-pack/bi/BiSolidGift'
import Traded from 'svelte-icons-pack/cg/CgArrowsExchange'
import Missed from 'svelte-icons-pack/ri/RiWeatherWindyLine'
import Deceased from 'svelte-icons-pack/fa/FaSolidSkullCrossbones'

export const NuzlockeStates = {
  1: { id: 1, state: 'Captured', icon: Ball },
  2: { id: 2, state: 'Received', icon: Gift },
  3: { id: 3, state: 'Traded', icon: Traded },
  4: { id: 4, state: 'Missed', icon: Missed },
  5: { id: 5, state: 'Dead', icon: Deceased },
}

export const NuzlockeGroups = {
  Available: [1, 2, 3],
  Dead: [5],
  Unavailable: [4, 5],
}
