import { Ball, Gift, Traded, Missed, Deceased, Shiny, Trash } from '$icons';

export const NuzlockeStates = {
  1: { id: 1, state: 'Captured', icon: Ball },
  2: { id: 2, state: 'Received', icon: Gift },
  6: { id: 6, state: 'Shiny', icon: Shiny },
  3: { id: 3, state: 'Traded', icon: Traded },
  4: { id: 4, state: 'Missed', icon: Missed },
  5: { id: 5, state: 'Dead', icon: Deceased },
  7: { id: 7, state: 'Trash', icon: Trash }
};

export const NuzlockeGroups = {
  Dupes: [1, 2, 3, 5, 7],
  Available: [1, 2, 3, 6],
  Dead: [5],
  Unavailable: [4, 5, 7]
};
