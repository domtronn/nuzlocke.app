export const capitalise = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

export const unslugify = (s = '') => s.replace(/-/g, ' ')
