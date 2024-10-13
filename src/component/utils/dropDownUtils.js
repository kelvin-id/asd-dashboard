export function initializeDropdown (dropdownElement, handlers) {
  if (!dropdownElement) {
    console.error('Dropdown element not found')
    return
  }

  dropdownElement.addEventListener('click', (event) => {
    const action = event.target.dataset.action // Assuming the action is stored in a data attribute
    console.log('Dropdown action clicked:', action)

    if (handlers && typeof handlers[action] === 'function') {
      handlers[action]() // Call the corresponding handler function
    } else {
      console.warn('Unknown or unhandled action:', action)
    }
  })
}
