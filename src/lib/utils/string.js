export const capitalise = (str, lowerRest = false) => {
  if (!str) return ''
  const [first, ...rest] = str
  return (
    first.toUpperCase() +
    (lowerRest ? rest.join('').toLowerCase() : rest.join(''))
  )
}

export const unslugify = (s = '') => s.replace(/-/g, ' ')
export const slugify = (s = '') => s.toLowerCase().replace(/ +/g, '-')

export const normalise = (s = '') => s.replace(/[-\.]/g, '')

export const toKebabCase = (str) => {
  try {
    return (
      str &&
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join('-')
    )
  } catch (e) {
    return str
  }
}

export const regionise = (str) =>
  str
    .replace(/(.*)-galar/, 'Galarian $1')
    .replace(/(.*)-alola/, 'Alolan $1')
    .replace(/(.*)-paldea/, 'Paldean $1')
    .replace(/(.*)-hisui/, 'Hisuin $1')
    .replace(/(.*)-hoenn/, 'Hoennian $1')
    .replace(/(.*)-sevii/, 'Seviian $1')
    .replace(/(.*)-mega/, 'Mega $1')
    .replace(/(.*)-f$/, '$1 ♀')
    .replace(/(.*)-m$/, '$1 ♂')

export const toSlug = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const toId = {
  encounter: (type) => toSlug(type + ' encounters'),
  boss: (boss, name) => toSlug(boss + ' ' + name)
}

export const toList = (arr, f = (i) => i, and = '&') => {
  const front = arr.slice(0, -1)
  const last = arr.slice(-1)[0]
  return front.map(f).join(', ') + (front.length ? ` ${and} ` : '') + f(last)
}
