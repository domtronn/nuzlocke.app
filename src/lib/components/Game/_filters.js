import { NuzlockeStates } from '$lib/data/states'

const normalise = (s = '') => s.toLowerCase().trim().replace(/é/g, 'e')

/** Search filter functions */
const routeSearch = (s, route) => {
  const { name, boss, encounters = [] } = route
  return (
    normalise(name).includes(s) ||
    normalise(boss).includes(s) ||
    encounters.some((i) => normalise(i).includes(s))
  )
}

const pokemonSearch = (s, item) => {
  const { pokemon, nickname, status } = item
  return (
    normalise(pokemon).includes(s) || // Search by pokemon name
    normalise(nickname).includes(s) || // Search by nickname
    normalise(NuzlockeStates[status]?.state).includes(s)
  ) // Search by status status
}

export const filterEntry = (filters, search, data, progress) => (route) => {
  const { main: fMain, route: fRoute } = filters
  const { origPos, name } = route

  const showUpcoming =
    fMain === 'upcoming' || (fMain === 'route' && fRoute === 'upcoming')

  if (showUpcoming && !search) return origPos >= progress
  if (!search) return true

  const entry = data[name]
  const s = normalise(search)

  const match = !entry
    ? routeSearch(s, route)
    : routeSearch(s, route) || pokemonSearch(s, route)

  return showUpcoming
    ? match && origPos >= progress // If displaying upcoming filter greater than upcoming
    : match
}
