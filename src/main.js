import { initializeBoards, switchBoard } from './component/board/boardManagement.js'
import { initializeDashboardMenu } from './component/menu/dashboardMenu.js'
import { loadInitialConfig, loadBoardState } from './storage/localStorage.js'
import { initializeDragAndDrop } from './component/widget/events/dragDrop.js'
import { fetchServices } from './utils/fetchServices.js'
import { getConfig } from './utils/getConfig.js'
import { openLocalStorageModal } from './component/modal/localStorageModal.js'
import { initializeBoardDropdown } from './component/board/boardDropdown.js'
import { initializeViewDropdown } from './component/view/viewDropdown.js'
import { Logger } from './utils/Logger.js'

const logger = new Logger('main.js')

localStorage.setItem('log', 'all')

window.asd = {
  services: [],
  config: {},
  boards: [],
  currentBoardId: null,
  currentViewId: null
}

document.addEventListener('DOMContentLoaded', async () => {
  logger.log('DOMContentLoaded event fired')
  fetchServices()
  await getConfig()

  initializeDashboardMenu()

  const boards = await loadBoardState()
  logger.log(`Loaded boards from localStorage: ${JSON.stringify(boards)}`)

  if (boards.length === 0 && window.asd.config.globalSettings.localStorage.loadDashboardFromConfig === 'true') {
    await loadInitialConfig()
  }

  const lastUsedBoardId = localStorage.getItem('lastUsedBoardId')
  const lastUsedViewId = localStorage.getItem('lastUsedViewId')
  logger.log(`Last used boardId: ${lastUsedBoardId}, viewId: ${lastUsedViewId}`)

  initializeBoards().then(async initialBoardView => {
    const boardIdToLoad = lastUsedBoardId || initialBoardView.boardId
    const viewIdToLoad = lastUsedViewId || initialBoardView.viewId
    window.asd.currentBoardId = boardIdToLoad
    window.asd.currentViewId = viewIdToLoad
    logger.log(`Set currentBoardId to: ${window.asd.currentBoardId}, currentViewId to: ${window.asd.currentViewId}`)
    logger.log(`Switching to boardId: ${boardIdToLoad}, viewId: ${viewIdToLoad}`)
    await switchBoard(boardIdToLoad, viewIdToLoad)
  }).catch(error => {
    logger.error('Failed to initialize boards:', error)
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
      logger.error('Error opening LocalStorage modal:', error)
    }
  })
})
