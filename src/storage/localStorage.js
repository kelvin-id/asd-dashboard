import { createWidget } from '../component/widget/widgetManagement.js'
import { getServiceFromUrl } from '../component/widget/utils/widgetUtils.js'
import { initializeResizeHandles } from '../component/widget/events/resizeHandler.js'
import { Logger } from '../utils/Logger.js'

const logger = new Logger('localStorage.js')

async function saveWidgetState (boardId, viewId) {
  if (!boardId) {
    boardId = document.querySelector('.board').id
  }
  if (!viewId) {
    viewId = document.querySelector('.board-view').id
  }
  try {
    logger.info(`saveWidgetState function called for board: ${boardId}, view: ${viewId}`)
    if (!viewId) {
      logger.error('View ID is missing. Cannot save widget state.')
      return
    }
    const widgetContainer = document.getElementById('widget-container')
    const widgets = Array.from(widgetContainer.children)
    const widgetState = widgets.map(widget => {
      let metadata = {}
      if (widget.dataset.metadata) {
        try {
          metadata = JSON.parse(widget.dataset.metadata)
        } catch (error) {
          logger.error('Error parsing metadata:', error)
          metadata = {} // Default to an empty object if parsing fails
        }
      }

      let settings = {}
      if (widget.dataset.settings) {
        try {
          settings = JSON.parse(widget.dataset.settings)
        } catch (error) {
          logger.error('Error parsing settings:', error)
          settings = {} // Default to an empty object if parsing fails
        }
      }

      const state = {
        dataid: widget.dataset.dataid, // Include dataid in the state
        order: widget.getAttribute('data-order'),
        url: widget.querySelector('iframe').src,
        columns: widget.dataset.columns || 1,
        rows: widget.dataset.rows || 1,
        type: widget.dataset.type || 'iframe',
        metadata,
        settings
      }
      logger.info('Saving widget state:', state)
      return state
    })
    const boards = await loadBoardState()
    logger.info(`Loaded board state from localStorage: ${boards}`)
    const board = boards.find(b => b.id === boardId)
    if (board) {
      logger.info(`Found board: ${board}`)
      const view = board.views.find(v => v.id === viewId)
      if (view) {
        logger.info(`Found view: ${view}`)
        view.widgetState = widgetState
        await saveBoardState(boards)
        logger.info(`Saved widget state to view: ${viewId} in board: ${boardId}`)
      } else {
        logger.error(`View not found: ${viewId}`)
      }
    } else {
      logger.error(`Board not found: ${boardId}`)
    }
  } catch (error) {
    logger.error('Error saving widget state:', error)
  }
}

async function loadWidgetState (boardId, viewId) {
  try {
    logger.info('loadWidgetState function called for board:', boardId, 'and view:', viewId)

    setBoardAndViewIds(boardId, viewId)

    const boards = await loadBoardState()
    logger.info('Loaded board state from localStorage:', boards)
    const board = boards.find(b => b.id === boardId)

    if (board) {
      logger.info('Found board:', board)
      const view = board.views.find(v => v.id === viewId)

      if (view && view.widgetState.length > 0) {
        logger.info('Found widget state in view:', view.widgetState)
        const savedState = view.widgetState
        const widgetContainer = document.getElementById('widget-container')
        const existingWidgetIds = Array.from(widgetContainer.children).map(w => w.dataset.dataid)

        for (const widgetData of savedState) {
          if (!existingWidgetIds.includes(widgetData.dataid)) {
            logger.info('Loading widget data:', widgetData)
            const service = await getServiceFromUrl(widgetData.url)
            const widgetWrapper = await createWidget(
              service,
              widgetData.url,
              widgetData.columns,
              widgetData.rows,
              widgetData.dataid // Ensure dataid is passed to maintain widget identity
            )
            widgetWrapper.dataset.order = widgetData.order
            widgetWrapper.style.order = widgetData.order
            widgetWrapper.dataset.type = widgetData.type
            widgetWrapper.dataset.metadata = JSON.stringify(widgetData.metadata)
            widgetWrapper.dataset.settings = JSON.stringify(widgetData.settings)
            widgetContainer.appendChild(widgetWrapper)
          }
        }

        // Initialize resize handles after all widgets are loaded
        initializeResizeHandles()
      } else {
        logger.info('No widget state found in view:', viewId)
      }
    } else {
      logger.error('Board not found:', boardId)
    }
  } catch (error) {
    logger.error('Error loading widget state:', error)
  }
}

async function loadInitialConfig () {
  try {
    const boards = window.asd.config.boards
    if (boards.length > 0) {
      await saveBoardState(boards)
    }
  } catch (error) {
    logger.error('Error loading initial configuration:', error)
  }
}

function setBoardAndViewIds (boardId, viewId) {
  const boardElement = document.querySelector('.board')
  boardElement.id = boardId
  const viewElement = document.querySelector('.board-view')
  viewElement.id = viewId
  window.asd.currentBoardId = boardId
  window.asd.currentViewId = viewId
  logger.log(`Set currentBoardId to: ${window.asd.currentBoardId}, currentViewId to: ${window.asd.currentViewId}`)
}

export async function saveBoardState (boards) {
  try {
    localStorage.setItem('boards', JSON.stringify(boards))
    logger.log('Saved board state to localStorage')
  } catch (error) {
    logger.error('Error saving board state:', error)
  }
}

export async function loadBoardState () {
  try {
    const boards = localStorage.getItem('boards')
    const parsedBoards = boards ? JSON.parse(boards) : []

    if (parsedBoards) {
      window.asd.boards = parsedBoards
    }
    logger.log('Loaded board state from localStorage:', parsedBoards)
    return parsedBoards
  } catch (error) {
    logger.error('Error loading board state:', error)
    return []
  }
}

export { saveWidgetState, loadWidgetState, loadInitialConfig }
