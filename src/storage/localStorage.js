import { createWidget } from '../component/widget/widgetManagement.js'
import { fetchServices } from '../component/widget/utils/fetchServices.js'
import { getConfig } from '../component/widget/utils/getConfig.js'
import { getServiceFromUrl } from '../component/widget/utils/widgetUtils.js'

async function saveWidgetState (boardId, viewId) {
  if (!boardId) {
    boardId = document.querySelector('.board').id
  }
  if (!viewId) {
    viewId = document.querySelector('.board-view').id
  }
  try {
    console.log('saveWidgetState function called for board:', boardId, 'and view:', viewId) // Add this log
    const widgetContainer = document.getElementById('widget-container')
    const widgets = Array.from(widgetContainer.children)
    const widgetState = widgets.map(widget => {
      const state = {
        order: widget.getAttribute('data-order'),
        url: widget.querySelector('iframe').src,
        columns: widget.dataset.columns || 1,
        rows: widget.dataset.rows || 1
      }
      console.log('Saving widget state:', state) // Add this log
      return state
    })
    const boards = await loadBoardState()
    console.log('Loaded board state from localStorage:', boards) // Add this log
    const board = boards.find(b => b.id === boardId)
    if (board) {
      console.log('Found board:', board) // Add this log
      const view = board.views.find(v => v.id === viewId)
      if (view) {
        console.log('Found view:', view) // Add this log
        view.widgetState = widgetState
        await saveBoardState(boards)
        console.log('Saved widget state to view:', viewId, 'in board:', boardId) // Add this log
      } else {
        console.error('View not found:', viewId) // Add this log
      }
    } else {
      console.error('Board not found:', boardId) // Add this log
    }
  } catch (error) {
    console.error('Error saving widget state:', error)
  }
}

async function loadWidgetState (boardId, viewId) {
  try {
    // Set the boardId and viewId
    const boardElement = document.querySelector('.board')
    boardElement.id = boardId
    const viewElement = document.querySelector('.board-view')
    viewElement.id = viewId

    // Fetch board details
    const boards = await loadBoardState()
    const board = boards.find(b => b.id === boardId)

    if (board) {
      const view = board.views.find(v => v.id === viewId)
      if (view && view.widgetState.length > 0) {
        const savedState = view.widgetState
        const config = await getConfig()
        const services = await fetchServices()
        const widgetContainer = document.getElementById('widget-container')
        widgetContainer.innerHTML = ''
        for (const widgetData of savedState) {
          const serviceConfig = services.find(service => service.url === widgetData.url)?.config || {}

          const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns
          const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns
          const minRows = serviceConfig.minRows || config.styling.grid.minRows
          const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows

          const columns = Math.min(Math.max(widgetData.columns, minColumns), maxColumns)
          const rows = Math.min(Math.max(widgetData.rows, minRows), maxRows)

          const service = await getServiceFromUrl(widgetData.url)
          const widgetWrapper = await createWidget(service, widgetData.url, columns, rows)
          widgetWrapper.dataset.order = widgetData.order
          widgetWrapper.style.order = widgetData.order
          widgetContainer.appendChild(widgetWrapper)
        }
      }
    }
  } catch (error) {
    console.error('Error loading widget state:', error)
  }
}

export async function saveBoardState (boards) {
  try {
    localStorage.setItem('boards', JSON.stringify(boards))
  } catch (error) {
    console.error('Error saving board state:', error)
  }
}

export async function loadBoardState () {
  try {
    const boards = localStorage.getItem('boards')
    const parsedBoards = boards ? JSON.parse(boards) : []
    return parsedBoards
  } catch (error) {
    console.error('Error loading board state:', error)
    return []
  }
}

export { saveWidgetState, loadWidgetState }
