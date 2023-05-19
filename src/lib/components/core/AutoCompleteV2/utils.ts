export const debouncePromise = (fn: Function, ms = 0) => {
  let timeoutId: Timeout
  const pending = []
  return (...args: any[]) =>
    new Promise((res, rej) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const currentPending = [...pending]
        pending.length = 0
        Promise.resolve(fn.apply(this, args)).then(
          (data) => {
            currentPending.forEach(({ resolve }) => resolve(data))
          },
          (error) => {
            currentPending.forEach(({ reject }) => reject(error))
          }
        )
      }, ms)
      pending.push({ resolve: res, reject: rej })
    })
}

/** Dispatch event on click outside of node */
export const clickOutside = (node) => {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('clickOutside', node))
    }
  }

  document.addEventListener('click', handleClick, true)
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    }
  }
}
