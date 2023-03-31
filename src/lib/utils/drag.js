export function drag (node, { data, id, effect, hideImg = false }) {
  node.setAttribute('draggable', true)

  const startListener = node.addEventListener('dragstart', (evt) => {
    const imgEl = evt.target.querySelector('[data-drag-img] i')
      || evt.target.querySelector('.data-drag-img i')
      || evt.target

    if (hideImg) imgEl.classList.remove('invisible')
    console.log('dragstart', evt.target, imgEl, effect)

    let position = [50,40]
    const { matches } = window.matchMedia("(max-width: 700px)")
    if (matches) position = [75, 65]

    evt.dataTransfer.effectAllowed = effect
    evt.dataTransfer.setDragImage(imgEl, ...position)
    evt.dataTransfer.setData('data', JSON.stringify(data))
    evt.dataTransfer.setData('effect', effect)
    if (id) evt.dataTransfer.setData('srcId', id)
  })

  const endListener = node.addEventListener('dragend', (evt) => {
    if (!hideImg) return
    const imgEl = evt.target.querySelector('[data-drag-img] > i')
      || evt.target.querySelector('.data-drag-img > i')
      || evt.target

    if (hideImg) imgEl.classList.add('invisible')
  })

  return {
    destroy() {
      node.removeEventListener('dragstart', startListener)
      node.removeEventListener('dragend', endListener)
    }
  }

}
