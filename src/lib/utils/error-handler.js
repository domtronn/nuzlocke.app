export default function createErrorHandlerModal() {
  const mContainer = document.createElement('div')
  const mModal = document.createElement('div')

  const cImage = document.createElement('img')
  const cHeading = document.createElement('h2')
  const cCopy = document.createElement('p')
  const cConfirm = document.createElement('button')

  cHeading.innerHTML = "Oh no! Something's gone wrong"
  cImage.src = 'https://img.nuzlocke.app/sprite/202.png'
  cImage.width = 92
  cImage.height = 92
  cCopy.innerHTML =
    'An unexpected error has occured, to prevent any data loss for your run you should <b>Reload the page</b> immediately.<br /><br /> Would you like to reload now?'

  cConfirm.innerText = 'Reload app'
  cConfirm.addEventListener('click', function () {
    window.location = window.location.pathname + '?force-pass=' + +new Date()
  })

  mModal.appendChild(cImage)
  mModal.appendChild(cHeading)
  mModal.appendChild(cCopy)
  mModal.appendChild(cConfirm)
  mModal.classList.add('error-modal')

  mContainer.appendChild(mModal)
  mContainer.classList.add('error-modal-container')

  document.body.appendChild(mContainer)
}
