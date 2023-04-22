import { capitalise, regionise, toList } from './string'
const locid = (mon) => mon.location

const Groups = {
  GymLeader: 'gym-leader',
  EliteFour: 'elite-four',
  EvilTeam: 'evil-team',
  MiniBoss: 'mini-bos',
  Rival: 'rival'
}

const Icons = {
  EliteFour: 'elite-four',
  Rival4: 'rival-100',
  Rival3: 'rival-050',
  Rival2: 'rival-025',
  Rival1: 'rival-000',
  EvilTeam4: 'evil-100',
  EvilTeam3: 'evil-050',
  EvilTeam2: 'evil-025',
  EvilTeam1: 'evil-000'
}

const summaryText = (pokemon, GymFights = [], Other = {}) => {
  const isChamp = Other?.[Groups.EliteFour] > 4
  const beatGym = GymFights.length > 0
  const beatRival = Other?.[Groups.Rival] > 0
  const beatEvil = Other?.[Groups.EvilTeam] > 0

  return [
    `${pokemon.nickname ? pokemon.nickname + ' the ' : ''}${capitalise(
      regionise(pokemon.pokemon)
    )}`,
    isChamp ? `is a league Champion` : `was a vital teammate`,
    beatGym
      ? `, helping to defeat ${toList(GymFights.map((g) => g.name))}`
      : '',
    isChamp ? (beatGym ? `and` : 'helping to defeat') : '',
    isChamp > 4 ? `the Pokémon league!` : `.`,
    beatRival > 0
      ? `${isChamp || beatGym ? 'They also' : 'They'} helped beat your rival ${
          Other[Groups.Rival]
        } time${Other[Groups.Rival] > 1 ? 's' : ''}.`
      : '',
    beatEvil > 0
      ? `They stopped evil doers ${Other[Groups.EvilTeam]} time${
          Other[Groups.EvilTeam] > 1 ? 's' : ''
        }.`
      : ''
  ]
    .filter((i) => i)
    .join(' ')
    .replace(/ ([,.])/g, '$1')
}

const summaryIcons = (GymFights = [], Other = {}) => {
  return [
    ...new Set([
      // ...(Other?.[Groups.EliteFour] > 4 ? [Icons.EliteFour] : []),
      // ...(
      //   Other?.[Groups.Rival] > 3
      //     ? [Icons.Rival4] : Other?.[Groups.Rival] > 2
      //     ? [Icons.Rival3] : Other?.[Groups.Rival] > 1
      //     ? [Icons.Rival2] : Other?.[Groups.Rival] > 0
      //     ? [Icons.Rival1] : []
      // ),
      // ...(
      //   Other?.[Groups.EvilTeam] > 6
      //     ? [Icons.EvilTeam4] : Other?.[Groups.EvilTeam] > 4
      //     ? [Icons.EvilTeam3] : Other?.[Groups.EvilTeam] > 2
      //     ? [Icons.EvilTeam2] : Other?.[Groups.EvilTeam] > 0
      //     ? [Icons.EvilTeam1] : []
      // ),
      ...GymFights.map((g) => g.icon)
    ])
  ]
}

export const summarise = (pokemon, teams = []) => {
  const bossEncounters = teams.filter((team) =>
    team.team.some((i) => i.id === locid(pokemon))
  )

  const [GymFights, Other] = bossEncounters.reduce(
    ([gFights, other], it) => {
      if (it.group === Groups.GymLeader) {
        const item = {
          name: it.name,
          icon: `${it.type || it.speciality || it.id || 'unknown'}`
        }

        return [gFights.concat(item), other]
      } else {
        const newOther = {
          ...other,
          [it.group]: (other[it.group] ?? 0) + 1
        }

        return [gFights, newOther]
      }
    },
    [[], {}]
  )

  const summary = summaryText(pokemon, GymFights, Other)
  const icons = summaryIcons(GymFights, Other)

  if (icons.length) return { summary, icons }
}
