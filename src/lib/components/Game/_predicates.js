const TYPES = { ROUTE: 'route', GYM: 'gym', CUSTOM: 'custom' }
const STARTER_ID = 'starter'

/**
 * A list of valid IDs to display routes for
 */
const ROUTE_FILTERS = ['nuzlocke', 'route', 'upcoming']
const GYM_FILTERS = ['nuzlocke', 'bosses', 'upcoming']

export const hideRouteF = (data) => {
  const locations = Object.values(data)
  const filled = locations // Has pokemon && status
    .filter(l => !!l.pokemon)
    .map(l => l.location)

  const planned = locations // Has pokemon but no status
    .filter(l => !!l.pokemon && !l.status)
    .map(l => l.location)

  return (route, filters) => {
    const { name } = route

    if (filters.route === 'planned') return !planned.includes(name) // Filter locations that are not planned
    if (filters.route === 'missed') return filled.includes(name) // Filter locations that are filled

    return false // Don't filter route
  }
}

/**
 * Predicate to say whether route data is
 * @param {} route
 * @returns {Boolean}
 */
export const showStarterRoute = (route, filters, hideRoute = _ => false) => {
  const { type, name } = route

  return type === TYPES.ROUTE && // Route data must be route type
    name.toLowerCase() === STARTER_ID && // Route name is starter
    ROUTE_FILTERS.includes(filters.main) &&
    !hideRoute(route, filters)
}

export const showRoute = (route, filters, hideRoute = _ => false) => {
  const { type } = route
  return type === TYPES.ROUTE &&
    ROUTE_FILTERS.includes(filters.main) &&
    !hideRoute(route, filters)
}

export const showCustom = (route, filters, hideRoute = _ => false) => {
  const { type } = route
  return type === TYPES.CUSTOM &&
    ROUTE_FILTERS.includes(filters.main) &&
    !hideRoute(route, filters)
}

export const showGym = (route, filters, hideRoute = _ => false) => {
  const { type, group } = route
  return type === TYPES.GYM &&
    GYM_FILTERS.includes(filters.main) &&
    (filters.main === 'nuzlocke' || filters.boss === 'all' || filters.boss === group)
}
