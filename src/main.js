import { initializeBoards, updateViewSelector } from './component/board/boardManagement.js'
import { initializeDashboardMenu } from './component/menu/dashboardMenu.js'
import { loadWidgetState, loadInitialConfig, loadBoardState } from './storage/localStorage.js'
import { initializeDragAndDrop } from './component/widget/events/dragDrop.js'
import { fetchServices } from './utils/fetchServices.js'
import { getConfig } from './utils/getConfig.js'
import { openLocalStorageModal } from './component/modal/localStorageModal.js'
import { initializeBoardDropdown } from './component/board/boardDropdown.js'
import { initializeViewDropdown } from './component/view/viewDropdown.js'

window.asd = {
  services: [],
  config: {},
  boards: []
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded event fired')
  fetchServices()
  await getConfig()

  initializeDashboardMenu()

  const boards = await loadBoardState()
  if (boards.length === 0 && window.asd.config.globalSettings.localStorage.loadDashboardFromConfig === 'true') {
    await loadInitialConfig()
  }

  initializeBoards().then(initialBoardView => {
    if (initialBoardView) {
      loadWidgetState(initialBoardView.boardId, initialBoardView.viewId)
      updateViewSelector(initialBoardView.boardId)
    }
  }).catch(error => {
    console.error('Failed to initialize boards:', error)
  })

  initializeDragAndDrop()

  // Initialize dropdowns
  initializeBoardDropdown()
  initializeViewDropdown()

  // Add event listener for the localStorage edit button
  document.getElementById('localStorage-edit-button').addEventListener('click', () => {
    try {
      openLocalStorageModal()
    } catch (error) {
      console.error('Error opening LocalStorage modal:', error)
    }
  })
})
