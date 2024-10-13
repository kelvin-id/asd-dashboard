import { showNotification } from '../dialog/notification.js'

window.s = () => showNotification('<textarea id= <textarea id= <textarea id= <textarea id=', 10000)

export function openLocalStorageModal () {
  // Check if the modal already exists
  if (document.getElementById('localStorage-modal')) {
    console.log('LocalStorage modal is already open')
    return
  }

  console.log('Opening LocalStorage modal')
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
      console.error('Error saving LocalStorage changes:', error)
    }
  })

  document.getElementById('cancel-localStorage').addEventListener('click', () => {
    console.log('Cancel button clicked, closing modal without saving changes')
    closeLocalStorageModal()
  })
}

function closeLocalStorageModal () {
  console.log('Closing LocalStorage modal')
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
    console.log('LocalStorage updated successfully')
    alert('LocalStorage updated successfully!')

    // Reload the page to reflect changes
    location.reload()
  } catch (error) {
    console.error('Invalid JSON format:', error)
    alert('Invalid JSON format!')
  }
}

function getLocalStorageData () {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    try {
      data[key] = JSON.parse(localStorage.getItem(key))
    } catch (error) {
      console.error(`Error parsing localStorage item with key "${key}":`, error)
      data[key] = localStorage.getItem(key)
    }
  }
  return data
}
