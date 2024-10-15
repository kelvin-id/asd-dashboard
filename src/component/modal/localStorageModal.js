import { showNotification } from '../dialog/notification.js'
import { Logger } from '../../utils/Logger.js'

const logger = new Logger('localStorageModal.js')

export function openLocalStorageModal () {
  // Check if the modal already exists
  if (document.getElementById('localStorage-modal')) {
    logger.log('LocalStorage modal is already open')
    return
  }

  logger.log('Opening LocalStorage modal')
  const modal = document.createElement('div')
  modal.id = 'localStorage-modal'
  modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit LocalStorage</h2>
            <textarea id="localStorage-content">${JSON.stringify(getLocalStorageData(), null, 2)}</textarea>
            <div class="modal-buttons">
                <button id="save-localStorage">Save</button>
                <button id="cancel-localStorage">Cancel</button>
            </div>
        </div>
    `
  document.body.appendChild(modal)

  document.getElementById('save-localStorage').addEventListener('click', () => {
    try {
      saveLocalStorageChanges()
      closeLocalStorageModal()
    } catch (error) {
      logger.error('Error saving LocalStorage changes:', error)
    }
  })

  document.getElementById('cancel-localStorage').addEventListener('click', () => {
    logger.log('Cancel button clicked, closing modal without saving changes')
    closeLocalStorageModal()
  })
}

function closeLocalStorageModal () {
  logger.log('Closing LocalStorage modal')
  const modal = document.getElementById('localStorage-modal')
  if (modal) {
    document.body.removeChild(modal)
  }
}

function saveLocalStorageChanges () {
  const content = document.getElementById('localStorage-content').value
  try {
    const parsedContent = JSON.parse(content)
    for (const key in parsedContent) {
      localStorage.setItem(key, JSON.stringify(parsedContent[key]))
    }
    logger.log('LocalStorage updated successfully')
    alert('LocalStorage updated successfully!')

    // Reload the page to reflect changes
    location.reload()
  } catch (error) {
    showNotification(`Invalid JSON format:${error}`)
  }
}

function getLocalStorageData () {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    try {
      data[key] = JSON.parse(localStorage.getItem(key))
    } catch (error) {
      logger.error(`Error parsing localStorage item with key "${key}":`, error)
      data[key] = localStorage.getItem(key)
    }
  }
  return data
}
