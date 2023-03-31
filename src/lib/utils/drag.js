export function drag (node, { data, id, effect, hideImg = false }) {
  node.setAttribute('draggable', true)

  const startListener = node.addEventListener('dragstart', (evt) => {
    const imgEl = evt.target.querySelector('[data-drag-img]')
      || evt.target.querySelector('.data-drag-img')
      || evt.target

    if (hideImg) imgEl.classList.remove('invisible')

    if (window.navigator) window.navigator.vibrate(200)

    evt.dataTransfer.effectAllowed = effect
    evt.dataTransfer.setDragImage(imgEl, 5, 5)
    evt.dataTransfer.setData('data', JSON.stringify(data))
    if (id) evt.dataTransfer.setData('srcId', id)
  })

  const endListener = node.addEventListener('dragend', (evt) => {
    const imgEl = evt.target.querySelector('[data-drag-img]')
      || evt.target.querySelector('.data-drag-img')
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
