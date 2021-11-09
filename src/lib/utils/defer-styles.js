const loaded = {}

export default (src) => {
  if (loaded[src]) return
  loaded[src] = true

  if (document.createStyleSheet) document.createStyleSheet(src)
  else {
    const [head] = document.getElementsByTagName('head')
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = src
    head.appendChild(link)
  }
}
