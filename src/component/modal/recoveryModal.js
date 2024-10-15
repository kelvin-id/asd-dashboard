export function showRecoveryModal (serviceObj, widgetWrapper) {
  console.log('Opening recovery modal for action:', serviceObj.name)

  const modal = document.createElement('div')
  modal.className = 'recovery-modal'
  modal.dataset.uuid = crypto.randomUUID()

  const iframe = document.createElement('iframe')
  iframe.src = serviceObj.url

  const instructions = document.createElement('p')
  instructions.textContent = "The action is being performed. Please wait a few moments and then press 'Done and Refresh Widget' to reload the widget."

  const doneButton = document.createElement('button')
  doneButton.textContent = 'Done and Refresh Widget'
  doneButton.onclick = () => {
    console.log('Done button clicked, refreshing widget.')
    modal.remove()
    try {
      const iframe = widgetWrapper.querySelector('iframe')
      iframe.src = widgetWrapper.dataset.url // Refresh iframe
      console.log('Widget iframe refreshed successfully.')
    } catch (error) {
      console.error('Error refreshing widget iframe:', error)
      alert('Failed to refresh widget. Please try again.')
    }
  }

  modal.appendChild(instructions)
  modal.appendChild(iframe)
  modal.appendChild(doneButton)

  document.body.appendChild(modal)
  console.log('Recovery modal displayed.')
}
