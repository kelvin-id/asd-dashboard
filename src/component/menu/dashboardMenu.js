import { addWidget } from '../widget/widgetManagement.js'
import { switchBoard, createBoard, addBoardToUI } from '../../component/board/boardManagement.js'
import { saveWidgetState } from '../../storage/localStorage.js'

let uiInitialized = false // Guard variable

function toggleButtons () {
  const widgetContainer = document.getElementById('widget-container')
  widgetContainer.classList.toggle('hide-widget-menu')
}

function initializeDashboardMenu () {
  if (uiInitialized) return // Guard clause
  uiInitialized = true

  document.getElementById('add-widget-button').addEventListener('click', () => {
    const serviceSelector = document.getElementById('service-selector')
    const widgetUrlInput = document.getElementById('widget-url')
    const boardElement = document.querySelector('.board')
    const url = serviceSelector.value || widgetUrlInput.value

    if (url) {
      console.log('Adding widget with selected service URL:', url, 'and boardElement:', boardElement.id)
      addWidget(url, 1, 1, 'iframe', boardElement.id)
    } else {
      alert('Please select a service or enter a URL.')
    }
  })

  document.getElementById('toggle-widget-buttons').addEventListener('click', toggleButtons)

  document.getElementById('reset-button').addEventListener('click', () => {
    localStorage.clear()
    location.reload()
  })

  document.getElementById('create-board-button').addEventListener('click', () => {
    const boardName = prompt('Enter board name:')
    if (boardName) {
      const newBoard = createBoard(boardName)
      addBoardToUI(newBoard)
    }
  })

  document.getElementById('board-selector').addEventListener('change', (event) => {
    const selectedBoardId = event.target.value
    console.log('Board selector changed, selectedBoardId:', selectedBoardId)
    const currentBoardId = document.querySelector('.board').id
    console.log(`Switching board ${currentBoardId} to ${selectedBoardId}`)
    saveWidgetState(currentBoardId) // Save the state of the current board before switching

    switchBoard(selectedBoardId) // Here we also load the state.
    // loadWidgetState(selectedBoardId) // Load the state of the selected board
  })
}

export { initializeDashboardMenu }
