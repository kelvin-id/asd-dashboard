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

const defaultBoardId = 'default-0' // Assuming 'default-0' is the default board ID

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired')
  fetchServices()

  initializeBoards()
  initializeDashboardMenu()
  initializeDragAndDrop()

  // const defaultBoardId = document.querySelector('.board').id;
  // Load the state of the default board initially
  loadWidgetState(defaultBoardId)
})
