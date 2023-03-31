export function drag (node, { data, id, effect }) {
  node.setAttribute('draggable', true)

  const evtListener = node.addEventListener('dragstart', (evt) => {
    const imgEl = evt.target.querySelector('[data-drag-img]')
      || evt.target.querySelector('.data-drag-img')
      || evt.target

    evt.dataTransfer.effectAllowed = effect
    evt.dataTransfer.setDragImage(imgEl, 5, 5)
    evt.dataTransfer.setData('data', JSON.stringify(data))
    if (id) evt.dataTransfer.setData('srcId', id)
  })
  return {
    destroy() {
      node.removeEventListener('dragstart',evtListener)
    }
  }

}
