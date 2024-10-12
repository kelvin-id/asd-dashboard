import { addWidget } from '../widget/widgetManagement.js'
import { switchBoard, createBoard, addBoardToUI, createView, switchView, updateViewSelector } from '../../component/board/boardManagement.js'
import { saveWidgetState } from '../../storage/localStorage.js'

let uiInitialized = false // Guard variable

function initializeDashboardMenu () {
  if (uiInitialized) return // Guard clause
  uiInitialized = true

  document.getElementById('add-widget-button').addEventListener('click', () => {
    const serviceSelector = document.getElementById('service-selector')
    const widgetUrlInput = document.getElementById('widget-url')
    const boardElement = document.querySelector('.board')
    const viewElement = document.querySelector('.board-view')
    const url = serviceSelector.value || widgetUrlInput.value

    if (url) {
      addWidget(url, 1, 1, 'iframe', boardElement.id, viewElement.id)
    } else {
      alert('Please select a service or enter a URL.')
    }
  })

  document.getElementById('toggle-widget-buttons').addEventListener('click', () => {
    const widgetContainer = document.getElementById('widget-container')
    widgetContainer.classList.toggle('hide-widget-menu')
  })

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

  document.getElementById('create-view-button').addEventListener('click', () => {
    const boardId = document.querySelector('.board').id
    const viewName = prompt('Enter view name:')
    if (viewName) {
      createView(boardId, viewName)
      updateViewSelector()
    }
  })

  document.getElementById('board-selector').addEventListener('change', (event) => {
    const selectedBoardId = event.target.value
    const currentBoardId = document.querySelector('.board').id
    saveWidgetState(currentBoardId) // Save the state of the current board before switching
    switchBoard(selectedBoardId)
    updateViewSelector()
  })

  document.getElementById('view-selector').addEventListener('change', (event) => {
    const selectedBoardId = document.querySelector('.board').id
    const selectedViewId = event.target.value
    console.debug(`Switching to selected view ${selectedViewId} in board ${selectedBoardId}`) // Add this log
    switchView(selectedBoardId, selectedViewId)
  })
}

export { initializeDashboardMenu }
