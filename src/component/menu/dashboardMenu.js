import { addWidget } from '../widget/widgetManagement.js'
import {
  switchBoard,
  createBoard,
  addBoardToUI,
  createView,
  switchView,
  updateViewSelector,
  renameBoard,
  deleteBoard,
  renameView,
  deleteView,
  resetView
} from '../../component/board/boardManagement.js'
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

  document.getElementById('rename-board-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    const newBoardName = prompt('Enter new board name:')
    if (newBoardName) {
      renameBoard(boardId, newBoardName)
    }
  })

  document.getElementById('delete-board-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    if (confirm('Are you sure you want to delete this board?')) {
      deleteBoard(boardId)
    }
  })

  document.getElementById('create-view-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    const viewName = prompt('Enter view name:')
    if (viewName) {
      createView(boardId, viewName)
      updateViewSelector(boardId)
    }
  })

  document.getElementById('rename-view-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    const viewId = getCurrentViewId()
    const newViewName = prompt('Enter new view name:')
    if (newViewName) {
      renameView(boardId, viewId, newViewName)
      updateViewSelector(boardId)
    }
  })

  document.getElementById('delete-view-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    const viewId = getCurrentViewId()
    if (confirm('Are you sure you want to delete this view?')) {
      deleteView(boardId, viewId)
      updateViewSelector(boardId)
    }
  })

  document.getElementById('reset-view-button').addEventListener('click', () => {
    const boardId = getCurrentBoardId()
    const viewId = getCurrentViewId()
    if (confirm('Are you sure you want to reset this view?')) {
      resetView(boardId, viewId)
    }
  })

  document.getElementById('board-selector').addEventListener('change', (event) => {
    const selectedBoardId = event.target.value
    const currentBoardId = getCurrentBoardId()
    saveWidgetState(currentBoardId) // Save the state of the current board before switching
    switchBoard(selectedBoardId)
    updateViewSelector(selectedBoardId)
  })

  document.getElementById('view-selector').addEventListener('change', (event) => {
    const selectedBoardId = getCurrentBoardId()
    const selectedViewId = event.target.value
    console.debug(`Switching to selected view ${selectedViewId} in board ${selectedBoardId}`) // Add this log
    switchView(selectedBoardId, selectedViewId)
  })
}

function getCurrentBoardId () {
  return document.querySelector('.board').id
}

function getCurrentViewId () {
  return document.querySelector('.board-view').id
}

export { initializeDashboardMenu }
