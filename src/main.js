import { initializeBoards } from './component/board/boardManagement.js'
import { initializeDashboardMenu } from './component/menu/dashboardMenu.js'
import { loadWidgetState } from './storage/localStorage.js'
import { initializeDragAndDrop } from './component/widget/events/dragDrop.js'
import { fetchServices } from './utils/fetchServices.js'

window.asd = {
  services: [],
  config: {},
  boards: []
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired')
  fetchServices()

  initializeDashboardMenu()

  initializeBoards().then(initialBoardView => {
    if (initialBoardView) {
      console.log(`Initial View ${initialBoardView.viewId}`)
      loadWidgetState(initialBoardView.boardId, initialBoardView.viewId)
    }
  }).catch(error => {
    console.error('Failed to initialize boards:', error)
  })

  initializeDragAndDrop()
})
