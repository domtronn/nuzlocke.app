export const pluralise = (s: string, amt: number) =>
  amt === 1 ? s.replace(/s$/, '') : s.replace(/s?$/, 's')
export const normalise = (s?: string): string => (s || '').toLowerCase().trim()

export const htmlLabel = (text: string, search?: string): string => {
  return (search || '')
    .split(' ')
    .reduce(
      (text, searchSeg) =>
        text.replace(new RegExp(`(${searchSeg})`, 'i'), `<b>$1</b>`),
      text
    )
}
